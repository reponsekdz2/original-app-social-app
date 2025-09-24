import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './db.js';
import initializeSocket from './socket.js';
import apiRouter from './api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true, // Allow requests from the frontend origin
        credentials: true
    }
});

// Session store setup
const MySQLStoreSession = MySQLStore(session);
const sessionStore = new MySQLStoreSession({}, pool);

const sessionMiddleware = session({
    key: 'talka_session',
    secret: process.env.SESSION_SECRET || 'a-very-strong-secret-key-for-development',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
});

app.use(sessionMiddleware);

// Middleware
app.use(cors({
    origin: true, // Reflect request origin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = path.join(__dirname, 'uploads');
        if (req.path.includes('carousel')) {
            dest = path.join(dest, 'carousel');
        } else if (file.fieldname === 'sticker') {
            dest = path.join(dest, 'stickers');
        } else if (file.fieldname === 'attachment') {
             dest = path.join(dest, 'attachments');
        }
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});
const upload = multer({ storage });

// Make io available to routers
app.set('io', io);

// API Routes
app.use('/api', apiRouter(upload));

// Initialize Socket.IO with session middleware
initializeSocket(io, sessionMiddleware);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
