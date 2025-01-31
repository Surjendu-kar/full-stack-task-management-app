import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  price: number;
  availability: boolean;
}

const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
});

export const Menu = mongoose.model<IMenuItem>("Menu", menuSchema);
