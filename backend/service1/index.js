const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello from Service 1!');
});

app.listen(PORT, () => {
  console.log(`Service 1 running on port ${PORT}`);
});
