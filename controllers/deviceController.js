const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const deviceModel = require('../models/deviceModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

exports.getAllDevices = catchAsync(async (req, res, next) => {
  const devices = await deviceModel.findAll();
  res.status(200).json({
    status: 'success',
    data: {
      devices
    }
  });
});

exports.getDevice = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  id = parseInt(id, 10);

  if (!id) {
    return next(new AppError('Device Id is incorrect!', 400));
  }

  const device = await deviceModel.findOne({
    where: {
      id
    }
  });

  if (!device) {
    return next(
      new AppError('Device not found!, please check device Id.', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      device
    }
  });
});

exports.createDevice = catchAsync(async (req, res, next) => {
  const device = await deviceModel.create(req.body);
  if (!device) {
    return next(new AppError('Bad request please provide body', 400));
  }
  res.status(200).json({
    status: 'success',
    data: {
      device
    }
  });
});

exports.updateDevice = catchAsync(async (req, res, next) => {
  const device = await deviceModel.findOne({
    where: { id: req.params.id }
  });

  if (!device) {
    return next(
      new AppError('Device not found!, please check device Id.', 404)
    );
  }

  const { model, doc } = req.body;
  await device.update({
    model,
    doc
  });

  res.status(200).json({
    status: 'success',
    data: {
      device
    }
  });
});

exports.deleteDevice = catchAsync(async (req, res, next) => {
  const device = await deviceModel.findOne({
    where: { id: req.params.id }
  });

  if (!device) {
    return next(
      new AppError('Device not found!, please check device Id.', 404)
    );
  }

  await device.destroy();

  res.status(204).json({
    status: 'success'
  });
});

exports.generateApiKey = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const device = await deviceModel.findOne({
    where: {
      id
    }
  });

  if (!device) {
    return next(
      new AppError('Device not found!, please check device Id.', 404)
    );
  }

  const apiKey = crypto.randomBytes(32).toString('hex');

  await device.update({ apiKey });

  res.status(200).json({
    status: 'success',
    data: {
      apiKey
    }
  });
});

exports.getApiKey = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const device = await deviceModel.findOne({
    where: {
      id
    }
  });

  if (!device) {
    return next(
      new AppError('Device not found!, please check device Id.', 404)
    );
  }

  const apiKey = device.apiKey;

  if (!apiKey) {
    return next(new AppError('There is not any API key for this device', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      apiKey
    }
  });
});