import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  category: string;
  price: number;
  availability: boolean;
}

const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages'],
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

export const Menu = mongoose.model<IMenuItem>('Menu', menuSchema); 