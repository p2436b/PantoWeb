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
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user'
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    passwordChangedAt: Sequelize.DATE,
    passwordResetToken: Sequelize.STRING,
    passwordResetExpires: Sequelize.DATE
  },
  {
    hooks: {
      beforeCreate: async user => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async user => {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
);

module.exports = User;
