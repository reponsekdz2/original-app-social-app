import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './api.js';
import authRoutes from './auth.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});