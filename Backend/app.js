require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const error = require('./middleware/error.middleware');

const { connectDb } = require('./config/db');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())


// Routes
app.use('/api/user', authRoutes);
app.use('/api/articles', articleRoutes);

app.get('/api', (req, res) => {
  res.send('Knowledge Hub API running');
});

app.use(error);

module.exports = app;



