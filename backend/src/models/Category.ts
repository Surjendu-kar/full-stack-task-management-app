import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  isActive: boolean;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
