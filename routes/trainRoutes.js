const express = require('express');

const trainController = require('../controllers/trainController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/')
  .get(trainController.getTrains)
  .post(trainController.postTrain);

Router.route('/:id')
  .get(trainController.getTrain)
  .patch(trainController.patchTrain)
  .delete(trainController.deleteTrain);

module.exports = Router;
