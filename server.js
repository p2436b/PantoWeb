process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught exception! Shutting down...');

  process.exit(1);
});

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const connection = require('./database/connection');
const app = require('./app');

const port = 3000;

const server = app.listen(port, () => {
  console.log(`Running server on port ${port}`);

  connection
    .sync({ force: false })
    .then(() => {
      console.log('Connection to database established successfully.');
    })
    .catch(e => {
      console.log('Unable to connect to the database!', e);
    });
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
