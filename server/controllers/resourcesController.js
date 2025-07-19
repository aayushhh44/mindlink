const { v4: uuidv4 } = require('uuid');
const Resource = require('../models/Resource');

// Get all resources
async function getResources(req, res) {
  try {
    const resources = await Resource.findAll();
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resources', error: err.message });
  }
}

// Upload a new resource
async function uploadResource(req, res) {
  const { title, type } = req.body;
  if (!title || !type) {
    return res.status(400).json({ message: 'Title and type are required' });
  }
  try {
    const resource = await Resource.create({
      resourceId: uuidv4(),
      title,
      type,
      uploadedBy: req.user.email,
    });
    res.status(201).json({ message: 'Resource uploaded', resource });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading resource', error: err.message });
  }
}

module.exports = { getResources, uploadResource }; 