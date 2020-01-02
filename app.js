const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const homeRouter = require('./routes/homeRoutes');
const trainRouter = require('./routes/trainRoutes');
const sensorRouter = require('./routes/sensorRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/', homeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/trains', trainRouter);
app.use('/api/v1/sensors', sensorRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
