import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { initSocket } from './socket.js';

// Import Routers
import apiRoutes from './api.js';
import authRoutes from './auth.js';
import aiRoutes from './ai.js';
import postRoutes from './posts.js';
import userRoutes from './users.js';
import reelRoutes from './reels.js';
import commentRoutes from './comments.js';
import messageRoutes from './messages.js';
import miscRoutes from './misc.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const port = 3000;

// Make io accessible to our routers
app.set('io', io);

initSocket(io);

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});


// --- API Routes ---
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/misc', miscRoutes);


// Root endpoint for health check
app.get('/', (req, res) => {
    res.status(200).send('talka backend is running and healthy!');
});


// --- Server Startup ---
server.listen(port, () => {
  console.log(`Backend server with Socket.IO listening at http://localhost:${port}`);
});