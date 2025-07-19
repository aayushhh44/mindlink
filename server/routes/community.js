const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/communityController');
const auth = require('../middleware/auth');

router.get('/', auth, getPosts);
router.post('/post', auth, createPost);

module.exports = router; 