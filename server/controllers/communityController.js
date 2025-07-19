const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');

// Create a new post
async function createPost(req, res) {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  try {
    const post = await Post.create({
      postId: uuidv4(),
      userId: req.user.userId,
      content,
      timestamp: new Date(),
    });
    res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
}

// Get all posts
async function getPosts(req, res) {
  try {
    const posts = await Post.findAll({ order: [['timestamp', 'DESC']] });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
}

module.exports = { createPost, getPosts }; 