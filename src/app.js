import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import setupLogger from './utils/logger.js';
import corsOptions from './utils/corsOptions.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

setupLogger(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1', apiRouter);
app.use(errorHandler);

export default app;