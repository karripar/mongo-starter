import mongoose from "mongoose";
import { Category} from "../../types/localTypes";

const categorySchema = new mongoose.Schema<Category>({
  category_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,

  }
});


export default mongoose.model<Category>('Category', categorySchema);
