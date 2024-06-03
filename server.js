import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDb();

// CORS setup to allow all origins and all methods, including credentials
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Reflect the request origin back
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route handlers
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => res.send('Server is ready'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
