const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const userModel = require('../models/userModel');
const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
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

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  // 3) If everythink okay, send token to client
  createSendToken(user, 200, res);
});

const changedPasswordAfter = (changedPasswordAt, jwtTimestamp) => {
  if (changedPasswordAt) {
    changedTimestamp = parseInt(changedPasswordAt.getTime() / 1000, 10);
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const user = await userModel.findByPk(decoded.id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    next(
      new AppError(
        'The user belonging to this token dose not longer exist.',
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (changedPasswordAfter(user.passwordChangedAt, decoded.iat)) {
    return next(
      new AppError('User recently changed password! please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin', 'maintainer']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

const createPasswordResetToken = async user => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  await user.update({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: Date.now() + 10 * 60 * 1000
  });
  return resetToken;
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await userModel.findOne({ where: { email: req.body.email } });
  if (!user)
    return next(new AppError('There is no user with email address.', 404));

  // 2) Generate the random reset token
  const resetToken = await createPasswordResetToken(user);

  // 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (error) {
    await user.update({
      passwordRestToken: null,
      passwordResetExpires: null
    });

    return next(
      new AppError(
        'There was an error sending the email, Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await userModel.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() }
    }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 3) Update changedPasswordAt property for the user
  await user.update({
    password: req.body.password,
    passwordChangedAt: Date.now() - 1000,
    passwordResetToken: null,
    passwordResetExpires: null
  });

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = async (req, res, next) => {
  const { id } = req.user;
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return next(new AppError('Bad request', 400));
  }
  // 1) Get user from collection
  const user = await userModel.findByPk(id);

  // 2) Check if POSTed current password is correct
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Your password is wrong!', 401));
  }

  // 3) If so, update password
  await user.update({
    password: newPassword,
    passwordChangedAt: Date.now() - 1000
  });

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
};
