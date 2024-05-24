import express from 'express';

const app = express();
const port = 5000;

app.get('/api/v1', (_req, res) => {
  res.send('Received GET request');
});

app.post('/api/v1', (req, res) => {
  res.send('Received POST request');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
