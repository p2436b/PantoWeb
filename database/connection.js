const Sequelize = require('sequelize');

const connection = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: false
    }
  }
);

module.exports = connection;
