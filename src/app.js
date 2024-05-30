import express from 'express';

const app = express();

app.use((err, _req, res, _next) => {
  console.log(err.stack);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.get('/api/v1', (_req, res) => {
  res.send('Received GET request');
});

app.post('/api/v1', (req, res) => {
  res.send('Received POST request');
});

export default app;