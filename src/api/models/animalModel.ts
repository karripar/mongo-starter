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
    max: Date.now(),
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});

animalSchema.index({location: '2dsphere'});

animalSchema.statics.findBySpecies = function (species_name: string) {
  return this.aggregate([
    // Join species collection
    {
      $lookup: {
        from: "species",
        localField: "species",
        foreignField: "_id",
        as: "species_info",
      },
    },
    { $unwind: "$species_info" },

    // Join categories collection
    {
      $lookup: {
        from: "categories",
        localField: "species_info.category",
        foreignField: "_id",
        as: "category_info",
      },
    },
    { $unwind: "$category_info" },

    // Match by species_name (case-insensitive) because why not
    {
      $match: {
        "species_info.species_name": {
          $regex: `^${species_name.trim()}$`,
          $options: "i",
        },
      },
    },

    // Remove __v fields
    {
      $project: {
        __v: 0,
        "species_info.__v": 0,
        "category_info.__v": 0,
      },
    },
  ]);
};


const animalModel = mongoose.model<Animal, AnimalModel>('Animal', animalSchema);

export default animalModel;
