import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import url from 'url';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import { v4 as uuidv4 } from 'uuid';
import generator from './utils/generator.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import brandRouter from './routes/brandRoutes.js';
import addressRouter from './routes/addressRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import errorMiddleware from './middlewares/errorHandler.js';

const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessLogStream = createStream(generator, {
  interval: '1d',
  path: path.join(__dirname, 'log'),
});

const logFormatString =
  ':id :remote-addr [:date] :method :url HTTP/:http-version :status :res[content-type] :res[content-length] - :response-time[0] ms';

morgan.token('id', req => req.id);

app.use((req, _res, next) => {
  req.id = uuidv4();
  next();
});

app.use(morgan(logFormatString, { stream: accessLogStream }));

app.use(
  morgan(logFormatString, {
    skip: (_req, res) => res.statusCode < 400,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', brandRouter);
app.use('/api/v1', addressRouter);
app.use('/api/v1', reviewRouter);

app.use(errorMiddleware);

export default app;