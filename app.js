const express = require('express');
const morgan = require('morgan');

const connection = require('./database/connection');
const userRouter = require('./routes/userRoutes');
const homeRouter = require('./routes/homeRoutes');
const trainRouter = require('./routes/trainRoutes');
const sensorRouter = require('./routes/sensorRoutes');

const userModel = require('./models/userModel');
const trainModel = require('./models/trainModel');
const tripModel = require('./models/tripModel');
const cameraModel = require('./models/cameraModel');
const accelerometerModel = require('./models/accelerometerModel');
const gpsTemptureModel = require('./models/gpsTemptureModel');
const deviceModel = require('./models/deviceModel');
const deviceConfigModel = require('./models/deviceConfigModel');
const trainDevice = require('./models/trainDevice');

const app = express();

connection
  .sync({ force: false })
  .then(() => {
    // trainModel.create({
    //   model: 'TG-800',
    //   doc: '2001-8-1'
    // });
    // deviceModel.create({
    //   model: 'PDMS-110',
    //   doc: '2008-6-1 8:2:23.123456',
    //   status: 1
    // });

    console.log('Connection to database established successfully.');
  })
  .catch(e => {
    console.log('Unable to connect to the database:', e);
  });

app.use(morgan('dev'));
app.use(express.json());

app.use('/', homeRouter);
app.use('/api/v1/users', userRouter)
app.use('/api/v1/trains', trainRouter);
app.use('/api/v1/sensors', sensorRouter);

module.exports = app;
