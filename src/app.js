import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import url from 'url';
import path from 'path';
import { createStream } from 'rotating-file-stream';
import { v4 as uuidv4 } from 'uuid';
import generator from './utils/generator.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

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
app.use('/api/v1', apiRouter);
app.use(errorHandler);

export default app;