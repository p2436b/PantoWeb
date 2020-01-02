const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AppError = require('../utils/appError');
const asyncCatch = require('../utils/catchAsync');
const userModel = require('../models/userModel');

exports.signup = asyncCatch(async (req, res, next) => {
  const newUser = await userModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    password: req.body.password
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await userModel.findOne({
    where: { email },
    attributes: ['id', 'email', 'password']
  });

  if (!user || !(await bcrypt.compare(password, user.dataValues.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  // 3) If everythink okay, send token to client
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access.', 401)
    );
  }

  // 2) Verification token

  // 3) Check if user still exists

  // 4) Check if user changed password after the token was issued

  next();
};
