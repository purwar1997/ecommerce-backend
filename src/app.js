import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import errorMiddleware from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', userRouter);

app.use(errorMiddleware);

export default app;