const express = require('express');
const sensorController = require('../controllers/sensorController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    sensorController.getData
  )
  .post(authController.protectApi, sensorController.postData);

Router.route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    sensorController.getData
  )
  .put(
    authController.protect,
    authController.restrictTo('admin'),
    sensorController.getData
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    sensorController.getData
  );

module.exports = Router;
