const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.findAll({
    where: { status: 10001 },
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

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.update({ status: 10003 }, { where: { id } });

  if (!user[0]) return next(new AppError('There is no user with Id', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
