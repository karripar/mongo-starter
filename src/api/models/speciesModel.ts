import { Species } from "../../types/localTypes";
import mongoose from "mongoose";

const speciesSchema = new mongoose.Schema<Species>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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
  image: {
    type: String,
    required: true,
  }
}
);

export default mongoose.model<Species>('Species', speciesSchema);
