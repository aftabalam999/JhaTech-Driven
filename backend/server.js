import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import analysisRoutes from './routes/analysis.js';
import partnerRoutes from './routes/partner.js';
import competitorRoutes from './routes/competitor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for simple testing/development setup
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/competitor', competitorRoutes);

// Auth config endpoint
app.get('/api/auth/config', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
});

// Server health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Running',
    time: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start Database connection and listen
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Server successfully launched on http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
};

startServer();
