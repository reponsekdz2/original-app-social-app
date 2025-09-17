import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './api.js';
import authRoutes from './auth.js';

const app = express();
const port = 3000;

// --- Middleware ---
// 1. CORS for cross-origin requests
app.use(cors());

// 2. Body parser for JSON and URL-encoded data
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 3. Advanced request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  if ((req.method === 'POST' || req.method === 'PUT') && req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', req.body);
  }
  next();
});


// --- API Routes ---
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint for health check
app.get('/', (req, res) => {
    res.status(200).send('Netflixgram backend is running and healthy!');
});


// --- Server Startup ---
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
