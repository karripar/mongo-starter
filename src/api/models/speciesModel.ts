import { Species } from "../../types/localTypes";
import mongoose, { Model } from "mongoose";

interface SpeciesModel extends Model<Species> {
  findByArea(polygon: GeoJSON.Polygon): Promise<Species[]>;
};

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
    }
  },
  image: {
    type: String,
    required: true,
  }
}
);

speciesSchema.index({ location: '2dsphere' });

// Static method
speciesSchema.statics.findByArea = function (polygon: GeoJSON.Polygon) {
  return this.find({
    location: {
      $geoWithin: {
        $geometry: polygon,
      },
    },
  });
};

const speciesModel = mongoose.model<Species, SpeciesModel>('Species', speciesSchema);
export default speciesModel;
