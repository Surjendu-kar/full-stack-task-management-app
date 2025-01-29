import mongoose, { Document, Schema } from 'mongoose';

interface OrderItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 