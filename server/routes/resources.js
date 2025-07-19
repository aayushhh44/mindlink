const express = require('express');
const router = express.Router();
const { getResources, uploadResource } = require('../controllers/resourcesController');
const auth = require('../middleware/auth');

router.get('/', auth, getResources);
router.post('/', auth, uploadResource);

module.exports = router; 