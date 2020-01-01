const Sequelize = require("sequelize");

const connection = require("../database/connection");

const DeviceConfig = connection.define("DeviceConfig", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accRate: Sequelize.FLOAT,
  imgRate: Sequelize.FLOAT,
  cordRate: Sequelize.FLOAT,
  timeWnd: Sequelize.FLOAT,
  setDate: Sequelize.DATE,
  deviceId: Sequelize.INTEGER
});

module.exports = DeviceConfig;
