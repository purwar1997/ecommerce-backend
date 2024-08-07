import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import config from '../config/env.config.js';
import { checkCouponExpiry } from './index.js';
import { CRON_JOB } from '../constants/common.js';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Home route',
  });
});

app.listen(config.cron.port, () =>
  console.log(`Server is running on http://localhost:${config.cron.port}`)
);

const scheduleJob = (cronExpression, jobFunction) => {
  cron.schedule(cronExpression, jobFunction, {
    scheduled: true,
    timezone: CRON_JOB.TIMEZONE,
  });
};

scheduleJob('0 0 * * *', checkCouponExpiry);
scheduleJob('*/5 * * * * *', () => console.log('Task running every 5 seconds'));
