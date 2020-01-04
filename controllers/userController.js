const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.findAll({
    attributes: { exclude: ['password'] }
  });
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUser = async (req, res, next) => {};

exports.createUser = async (req, res, next) => {};

exports.updatetUser = async (req, res, next) => {};

exports.deleteUser = async (req, res, next) => {};
