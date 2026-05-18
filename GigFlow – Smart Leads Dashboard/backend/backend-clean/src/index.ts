import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser clients (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    
    // Check against authorized host patterns
    if (
      origin.startsWith('http://localhost:') || 
      origin.startsWith('http://127.0.0.1:') ||
      origin === 'https://gig-flow-smart-leads-dashboard-nine.vercel.app' ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    
    // Check optional dynamic allowed origins from environment variable
    if (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Base route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to GigFlow - Smart Leads Dashboard API',
    status: 'Running',
    version: '1.0.0',
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT as number, "0.0.0.0", () => {
  console.log(`Server running in production mode on port ${PORT}`);
});
