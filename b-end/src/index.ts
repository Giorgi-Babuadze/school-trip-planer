import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import tourRoutes from './routes/tourRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import tripRequestRoutes from './routes/tripRequestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import trainingDataRoutes from './routes/trainingDataRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/trip-requests', tripRequestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/training-data', trainingDataRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'School Trip Planner API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tours: '/api/tours',
      bookings: '/api/bookings',
      tripRequests: '/api/trip-requests',
      chat: '/api/chat',
      trainingData: '/api/training-data',
      health: '/api/health',
    },
  });
});

// Error handling for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
