const Sequelize = require("sequelize");

const connection = require("../database/connection");

const Device = connection.define("Device", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  model: Sequelize.STRING(50),
  doc: Sequelize.DATE,
  status: Sequelize.INTEGER
});

module.exports = Device;
