import config from './config/config.js';
import connectDB from './db/index.js';
import app from './app.js';

(async () => {
  try {
    await connectDB();

    app.on('error', error => {
      throw error;
    });

    app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log('ERROR:', error);
    process.exit(1);
  }
})();
