const Sequelize = require('sequelize');

const connection = new Sequelize('pantoweb', 'postgres', '1364', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false
  }
});

module.exports = connection;
