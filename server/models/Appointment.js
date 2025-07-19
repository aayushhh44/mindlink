const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Appointment = sequelize.define('Appointment', {
  appointmentId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Appointment; 