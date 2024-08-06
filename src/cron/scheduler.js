import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { checkCouponExpiry } from './index.js';
import { CRON_JOB } from '../constants/common.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log('Home route');

  res.status(200).json({
    message: 'Home route',
  });
});

app.listen(process.env.CRON_PORT, () => console.log(`Server is running on port 5000`));

const scheduleJob = (cronExpression, jobFunction) => {
  cron.schedule(cronExpression, jobFunction, {
    scheduled: true,
    timezone: CRON_JOB.TIMEZONE,
  });
};

scheduleJob('0 0 * * *', checkCouponExpiry);
scheduleJob('*/5 * * * * *', () => console.log('Task running every 5 seconds'));
