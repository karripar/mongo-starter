import {Animal} from '../../types/localTypes';
import mongoose from 'mongoose';
import {AnimalModel} from '../../types/localTypes';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  birthdate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value: Date) {
        return value <= new Date();
      },
      message: 'Birthdate cannot be in the future.',
    },
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String, // 'Point'
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere', // Index for geospatial queries
    },
  },
});

animalSchema.statics.findBySpecies = async function (species_name: string) {
  const SpeciesModel = mongoose.model('Species');
  const speciesDoc = await SpeciesModel.findOne({
    species_name: {$regex: `^${species_name.trim()}$`, $options: 'i'},
  });

  if (!speciesDoc) {
    return [];
  }

  return this.aggregate([
    {$match: {species: speciesDoc._id}},
    {
      $lookup: {
        from: 'species',
        localField: 'species',
        foreignField: '_id',
        as: 'speciesDetails',
      },
    },
    {$unwind: '$speciesDetails'},
    {
      $project: {
        animal_name: 1,
        birthdate: 1,
        location: 1,
        species: '$speciesDetails',
      },
    },
  ]);
};

const animalModel = mongoose.model<Animal, AnimalModel>('Animal', animalSchema);

export default animalModel;
