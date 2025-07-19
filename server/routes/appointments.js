const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, getAllAppointments } = require('../controllers/appointmentsController');
const auth = require('../middleware/auth');

router.get('/', auth, getAppointments);
router.get('/all', auth, getAllAppointments);
router.post('/book', auth, bookAppointment);

module.exports = router; 