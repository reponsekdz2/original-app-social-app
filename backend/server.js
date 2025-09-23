
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Import routes
import authRoutes from './auth.js';
import userRoutes from './users.js';
import postRoutes from './posts.js';
import reelRoutes from './reels.js';
import storyRoutes from './stories.js';
import messageRoutes from './messages.js';
import commentRoutes from './comments.js';
import miscRoutes from './misc.js';
import adminRoutes from './admin.js';
import reportRoutes from './reports.js';
import searchRoutes from './search.js';
import livestreamRoutes from './livestreams.js';


import initializeSocket from './socket.js';
import pool from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const MySQLStoreSession = MySQLStore(session);
const sessionStore = new MySQLStoreSession({}, pool);

const sessionMiddleware = session({
  key: 'talka_session',
  secret: process.env.SESSION_SECRET || 'your-default-super-secret-key-that-is-long',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'lax'
  }
});

// --- MIDDLEWARE ---
app.use(cors({
  origin: true, // In a real app, you would set this to your frontend's domain
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(sessionMiddleware);

// --- MULTER SETUP for File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dynamically set destination based on file type or route
    // For now, a general 'uploads' folder
    cb(null, 'backend/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes(upload));
app.use('/api/reels', reelRoutes(upload));
app.use('/api/stories', storyRoutes(upload));
app.use('/api/messages', messageRoutes(upload));
app.use('/api/comments', commentRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/admin', adminRoutes(upload));
app.use('/api/reports', reportRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/livestreams', livestreamRoutes);


// Simple welcome route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the talka API!' });
});


// --- SOCKET.IO ---
initializeSocket(io, sessionMiddleware);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
