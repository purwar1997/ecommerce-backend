import config from './config/config.js';
import connectDB from './db/index.js';
import app from './app.js';

(async () => {
  try {
    await connectDB();

    app.on('error', error => {
      throw error;
    });

    app.listen(config.server.port, () => {
      console.log(`Server is running on http://localhost:${config.server.port}`);
    });
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
})();
