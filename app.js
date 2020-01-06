const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const authController = require('./controllers/authController');
const userRouter = require('./routes/userRoutes');
const homeRouter = require('./routes/homeRoutes');
const trainRouter = require('./routes/trainRoutes');
const deviceRouter = require('./routes/deviceRoutes');
const sensorRouter = require('./routes/sensorRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/', homeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trains', authController.protect, trainRouter);
app.use('/api/v1/devices', authController.protect, deviceRouter);
app.use('/api/v1/sensors', sensorRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
