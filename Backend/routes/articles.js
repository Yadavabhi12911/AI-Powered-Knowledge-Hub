const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate.middleware.js.js');
const { authorize } = require('../middleware/authorize.middleware.js.js');
const {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  summarizeArticle
} = require('../controllers/articleController');
const User = require('../models/User');

router.use(authenticate);

router.post('/create-article',authenticate, createArticle);
router.get('/get-all-articles', authenticate, getArticles);
router.get('/get-article/:id', authenticate,  getArticle);
router.patch('/update-article/:id', authenticate, updateArticle);
router.delete('/delete-article/:id', authorize, deleteArticle);
router.post('/ai-content/:id/summarize',authenticate, summarizeArticle);

router.get('/users', authorize, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 