const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');

const JWT_SECRET = process.env.JWT_SECRET || 'kdsnkjn@434jnfkdsap';

exports.register = async (req, res) => {
  console.log('Register endpoint hit:', req.body);
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || 'patient' });
    const token = jwt.sign({ userId: user.userId, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { userId: user.userId, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.userId, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { userId: user.userId, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { name, email, password } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    const token = jwt.sign({ userId: user.userId, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { userId: user.userId, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

exports.debugSecret = (req, res) => {
  res.json({ JWT_SECRET: JWT_SECRET });
};

exports.decodeToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No token provided' });
  try {
    const decoded = require('jsonwebtoken').verify(token, JWT_SECRET);
    res.json({ decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

exports.getUserNames = async (req, res) => {
  const { userIds } = req.body;
  if (!Array.isArray(userIds)) return res.status(400).json({ message: 'userIds must be an array' });
  try {
    const users = await User.findAll({ where: { userId: userIds } });
    const userMap = {};
    users.forEach(u => { userMap[u.userId] = u.name; });
    res.json({ userMap });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user names', error: err.message });
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

exports.changeUserRoleByAdmin = async (req, res) => {
  const { userId, newRole } = req.body;
  if (!userId || !newRole) return res.status(400).json({ message: 'userId and newRole are required' });
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = newRole;
    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error('Error changing user role:', err);
    res.status(500).json({ message: 'Failed to change user role', error: err.message });
  }
};

exports.resetUserPasswordByAdmin = async (req, res) => {
  const { userId, newPassword } = req.body;
  if (!userId || !newPassword) return res.status(400).json({ message: 'userId and newPassword are required' });
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'User password reset successfully' });
  } catch (err) {
    console.error('Error resetting user password:', err);
    res.status(500).json({ message: 'Failed to reset user password', error: err.message });
  }
};

exports.exportUsersCSV = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['userId', 'name', 'email', 'role'] });
    const usersPlain = users.map(u => u.get({ plain: true }));
    const parser = new Parser({ fields: ['userId', 'name', 'email', 'role'] });
    const csv = parser.parse(usersPlain);
    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    return res.send(csv);
  } catch (err) {
    console.error('Error exporting users as CSV:', err);
    res.status(500).json({ message: 'Failed to export users', error: err.message });
  }
}; 