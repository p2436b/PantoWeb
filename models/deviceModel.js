const Sequelize = require('sequelize');

const connection = require('../database/connection');

const Device = connection.define('Device', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  model: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  doc: Sequelize.DATE,
  apiKey: {
    type: Sequelize.STRING,
    unique: true
  },
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 10001
  }
});

module.exports = Device;
