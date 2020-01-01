const Sequelize = require("sequelize");

const connection = require("../database/connection");

const Train = connection.define("Train", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  model: Sequelize.STRING(50),
  doc: Sequelize.DATE
});

module.exports = Train;
