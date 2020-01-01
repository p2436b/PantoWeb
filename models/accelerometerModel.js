const Sequelize = require("sequelize");

const connection = require("../database/connection");

const Accelerometer = connection.define("Accelerometer", {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: Sequelize.DATE,
  accNo: Sequelize.INTEGER,
  x: Sequelize.FLOAT,
  y: Sequelize.FLOAT,
  z: Sequelize.FLOAT,
  t: Sequelize.FLOAT,
  trainId: Sequelize.UUID,
  deviceId: Sequelize.INTEGER
});

module.exports = Accelerometer;
