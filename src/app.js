import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', userRouter);

app.use((err, _req, res, _next) => {
  console.log(err.stack);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

export default app;