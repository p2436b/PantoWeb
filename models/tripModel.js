const Sequelize = require("sequelize");

const connection = require("../database/connection");

const Trip = connection.define("Trip", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  startTime: Sequelize.DATE,
  endTime: Sequelize.DATE,
  trainId: Sequelize.UUID
});

module.exports = Trip;
