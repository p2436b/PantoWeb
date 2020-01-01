const Sequelize = require("sequelize");

const connection = require("../database/connection");

const GpsTempture = connection.define("GpsTempture", {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: Sequelize.DATE,
  latitude: Sequelize.DECIMAL(10, 8),
  longitude: Sequelize.DECIMAL(11, 8),
  temp: Sequelize.FLOAT,
  trainId: Sequelize.UUID,
  deviceId: Sequelize.INTEGER
});

module.exports = GpsTempture;
