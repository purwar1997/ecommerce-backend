import { format } from 'date-fns';
import url from 'url';
import path from 'path';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { createStream } from 'rotating-file-stream';

const formatDate = date => {
  const dateString = format(date, 'yyyy-MM-dd');
  return `access-${dateString}.log`;
};

const generateFilename = date => {
  if (!date) {
    return formatDate(new Date());
  }

  return formatDate(date);
};

const setupLogger = app => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const accessLogStream = createStream(generateFilename, {
    interval: '1d',
    path: path.join(__dirname, '..', 'log'),
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
};

export default setupLogger;
