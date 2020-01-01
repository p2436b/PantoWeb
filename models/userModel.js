const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const connection = require('../database/connection');

const User = connection.define(
  'User',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    firstName: Sequelize.STRING(50),
    lastName: Sequelize.STRING(50),
    mobile: Sequelize.STRING(15),
    email: {
      type: Sequelize.STRING(50),
      required: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      required: true
    }
  },
  {
    hooks: {
      beforeCreate: async user => {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
);

module.exports = User;
