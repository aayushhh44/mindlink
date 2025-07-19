const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, updateProfile, getUserNames, debugSecret, decodeToken, deleteUserByAdmin, changeUserRoleByAdmin, getUserActivityLogs, resetUserPasswordByAdmin, exportUsersCSV } = require('../controllers/authController');
const { isAdmin } = require('../middleware/auth');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', auth, updateProfile);
router.post('/usernames', auth, getUserNames);
router.get('/debug-secret', debugSecret);
router.get('/decode-token', decodeToken);

// Admin-only endpoints
router.get('/admin/psychiatrists', auth, isAdmin, async (req, res) => {
  try {
    const psychiatrists = await User.findAll({ where: { role: 'psychiatrist' }, attributes: { exclude: ['password'] } });
    res.json({ psychiatrists });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch psychiatrists', error: err.message });
  }
});

router.get('/admin/patients', auth, isAdmin, async (req, res) => {
  try {
    const patients = await User.findAll({ where: { role: 'patient' }, attributes: { exclude: ['password'] } });
    res.json({ patients });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patients', error: err.message });
  }
});

router.get('/admin/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

router.delete('/admin/user/:userId', auth, isAdmin, deleteUserByAdmin);
router.post('/admin/user/role', auth, isAdmin, changeUserRoleByAdmin);
router.post('/admin/user/reset-password', auth, isAdmin, resetUserPasswordByAdmin);

module.exports = router; 