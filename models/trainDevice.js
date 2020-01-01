const Sequelize = require("sequelize");

const connection = require("../database/connection");

const TrainDevice = connection.define("TrainDevice", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  installDate: Sequelize.DATE,
  uninstallDate: Sequelize.DATE,
  trainId: Sequelize.UUID,
  deviceId: Sequelize.INTEGER
});

module.exports = TrainDevice;
