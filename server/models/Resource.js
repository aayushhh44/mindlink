const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Resource = sequelize.define('Resource', {
  resourceId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Resource; 