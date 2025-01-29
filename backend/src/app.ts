import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { menuRouter } from './routes/menu.routes';
import { errorHandler } from './middleware/error.middleware';
import { orderRouter } from './routes/order.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', orderRouter);

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 