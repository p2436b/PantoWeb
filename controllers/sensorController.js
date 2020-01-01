const cameraModel = require('../models/cameraModel');
const accelerometerModel = require('../models/accelerometerModel');
const gpsTemptureModel = require('../models/gpsTemptureModel');

exports.postData = async (req, res) => {
  try {
    const { accelerometer, camera, gpsTempture } = req.body;

    if (camera) {
      cameraModel.bulkCreate(camera);
    }
    if (accelerometer) {
      accelerometerModel.bulkCreate(accelerometer);
    }
    if (gpsTempture) {
      gpsTemptureModel.bulkCreate(gpsTempture);
    }

    res.status(200).json({
      status: 'success',
      data: 'Post data'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.getData = async (req, res, next) => {
  try {
    const sensorType = req.query.type;
    console.log(sensorType);

    let data = undefined;

    if (sensorType === 'camera') {
      data = await cameraModel.findAll();
    } else if (sensorType === 'accelerometer') {
      data = await accelerometerModel.findAll();
    } else if (sensorType === 'gpstempture') {
      data = await gpsTemptureModel.findAll();
    }

    if (data) {
      res.status(200).json({
        status: 'success',
        [sensorType]: data
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Not found!'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};
