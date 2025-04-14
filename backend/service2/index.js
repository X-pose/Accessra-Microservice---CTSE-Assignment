const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Hello from Service 2!');
});

app.listen(PORT, () => {
  console.log(`Service 2 running on port ${PORT}`);
});
