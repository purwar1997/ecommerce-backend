import config from './config/config.js';
import connectDB from './db/index.js';
import app from './app.js';

(async () => {
  try {
    await connectDB();

    app.on('error', err => {
      throw err;
    });

    app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
})();
