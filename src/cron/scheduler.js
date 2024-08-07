import express from 'express';
import cron from 'node-cron';
import config from '../config/env.config.js';
import { checkCouponExpiry } from './index.js';
import { CRON_OPTIONS } from '../constants/common.js';

const app = express();

app.listen(config.cron.port, () =>
  console.log(`Server is running on http://localhost:${config.cron.port}`)
);

const scheduleJob = (cronExpression, jobFunction) => {
  cron.schedule(cronExpression, jobFunction, {
    scheduled: true,
    timezone: CRON_OPTIONS.TIMEZONE,
  });
};

scheduleJob('0 0 * * *', checkCouponExpiry);
