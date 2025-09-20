import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Socket.io setup
import { initSocket } from './socket.js';

// Route imports
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import reelRoutes from './reels.js';
import storyRoutes from './stories.js';
import messageRoutes from './messages.js';
import userRoutes from './users.js';
import miscRoutes from './misc.js';
import adminRoutes from './admin.js';
import livestreamRoutes from './livestreams.js';
import reportRoutes from './reports.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity, restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});
app.set('io', io); // Make io accessible in request handlers

// Initialize Socket.io
initSocket(io);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/livestreams', livestreamRoutes);
app.use('/api/reports', reportRoutes);


// Basic route for testing
app.get('/', (req, res) => {
  res.send('Talka backend is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});