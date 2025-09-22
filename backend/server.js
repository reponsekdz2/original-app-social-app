import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import MySQLStoreFactory from 'connect-mysql2';
import pool from './db.js';

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
import commentRoutes from './comments.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // Allow any origin for Socket.IO
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Allow cookies to be sent
  }
});
app.set('io', io); // Make io accessible in request handlers

// Initialize Socket.io
initSocket(io);

// Middleware
app.use(cors({
    origin: true, // Allow any origin for Express API
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({}, pool);

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_strong_secret_key_for_sessions',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side JS from accessing the cookie
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    }
}));


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/assets', express.static(path.join(__dirname, 'uploads/assets')));

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
app.use('/api/comments', commentRoutes);


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