const express = require('express');
const sensorController = require('../controllers/sensorController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/')
  .get(authController.protect,sensorController.getData)
  .post(sensorController.postData);

Router.route('/:id')
  .get(authController.protect, sensorController.getData)
  .put(sensorController.getData)
  .delete(sensorController.getData);

module.exports = Router;
