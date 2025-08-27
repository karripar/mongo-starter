import { Animal } from "../../types/localTypes";
import mongoose from "mongoose";

interface AnimalModel extends mongoose.Model<Animal> {
  findBySpecies(species: string): Promise<Animal[]>;
};

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
      message: 'Birthdate cannot be in the future.'
    }
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
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // Index for geospatial queries
    }
},

}
);

animalSchema.statics.findBySpecies = async function (speciesName: string) {
  const SpeciesModel = mongoose.model("Species");
  const speciesDoc = await SpeciesModel.findOne({
    species_name: { $regex: `^${speciesName.trim()}$`, $options: 'i' }
  });



  if (!speciesDoc) {
    return [];
  }

  return this.find({ species: speciesDoc._id }).populate("species");
};


const animalModel = mongoose.model<Animal, AnimalModel>(
  "Animal",
  animalSchema,
);

export default animalModel;

