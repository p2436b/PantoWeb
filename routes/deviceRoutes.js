const express = require('express');

const authController = require('../controllers/authController');
const deviceController = require('../controllers/deviceController');

const router = express.Router();

router
  .route('/')
  .post(deviceController.createDevice)
  .get(deviceController.getAllDevices);

router
  .route('/:id')
  .get(deviceController.getDevice)
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

router
  .route('/:id/apiKey')
  .post(authController.restrictTo('admin'), deviceController.generateApiKey)
  .get(
    authController.restrictTo('admin'),
    authController.protectApi,
    deviceController.getApiKey
  );

module.exports = router;
