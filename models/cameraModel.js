const Sequelize = require("sequelize");

const connection = require("../database/connection");

const Camera = connection.define("Camera", {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: Sequelize.DATE,
  stager: Sequelize.FLOAT,
  height: Sequelize.FLOAT,
  trainId: Sequelize.UUID,
  deviceId: Sequelize.INTEGER
});

module.exports = Camera;
