const { v4: uuidv4 } = require('uuid');
const Appointment = require('../models/Appointment');

// Book appointment
async function bookAppointment(req, res) {
  const { doctorId, dateTime } = req.body;
  if (!doctorId || !dateTime) {
    return res.status(400).json({ message: 'Doctor ID and date/time are required' });
  }
  try {
    const appointment = await Appointment.create({
      appointmentId: uuidv4(),
      userId: req.user.userId,
      doctorId,
      dateTime,
    });
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment', error: err.message });
  }
}

// Get appointments for the logged-in user
async function getAppointments(req, res) {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.userId },
      order: [['dateTime', 'DESC']],
    });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
}

// Get all appointments (psychiatrist only)
async function getAllAppointments(req, res) {
  if (req.user.role !== 'psychiatrist') {
    return res.status(403).json({ message: 'Forbidden: Only psychiatrists can view all appointments.' });
  }
  try {
    const appointments = await Appointment.findAll({ order: [['dateTime', 'DESC']] });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all appointments', error: err.message });
  }
}

module.exports = { bookAppointment, getAppointments, getAllAppointments }; 