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

// 3. Simple request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
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
