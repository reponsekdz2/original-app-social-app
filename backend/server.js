import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initSocket } from './socket.js';

// Load environment variables
dotenv.config();

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
import storyRoutes from './stories.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, restrict this to your frontend's URL
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const port = process.env.PORT || 3000;

// Make io accessible to our routers by attaching it to the app object
app.set('io', io);

// Initialize Socket.IO connection handling
initSocket(io);

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Request logger for debugging
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
app.use('/api/stories', storyRoutes);


// Root endpoint for health check
app.get('/', (req, res) => {
    res.status(200).send('talka backend is running and healthy!');
});


// --- Server Startup ---
server.listen(port, () => {
  console.log(`Backend server with Socket.IO listening at http://localhost:${port}`);
});
