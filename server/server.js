const express = require('express');
const path = require('path');
const { requireAuth } = require('@clerk/express');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Middleware 
app.get('/public', (req, res) => {
  res.send('This is a public route.');
});

app.get('/protected', requireAuth(), (req, res) => {
  res.send(`Hello ${req.auth.userId}, you are authenticated!`);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});