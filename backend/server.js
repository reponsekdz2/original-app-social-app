
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { initSocket } from './socket.js';
import apiRoutes from './api.js';
import authRoutes from './auth.js';
import aiRoutes from './ai.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity
        methods: ["GET", "POST"]
    }
});

const port = 3000;

// Make io accessible to our router
app.set('io', io);

initSocket(io);

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
      // Avoid logging large base64 strings
      const bodyToLog = { ...req.body };
      if (bodyToLog.base64Data) bodyToLog.base64Data = '...<base64_data>...';
      if (bodyToLog.media) bodyToLog.media = `...<${bodyToLog.media.length} media items>...`;
      console.log('Request Body:', bodyToLog);
  }
  next();
});


// --- API Routes ---
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint for health check
app.get('/', (req, res) => {
    res.status(200).send('talka backend is running and healthy!');
});


// --- Server Startup ---
server.listen(port, () => {
  console.log(`Backend server with Socket.IO listening at http://localhost:${port}`);
});