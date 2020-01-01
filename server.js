const dotenv = require('dotenv');
dotenv.config({path:`${__dirname}/config.env`});

const app = require('./app');

const port = 3000;

app.listen(port, () => {
  console.log(`Running server on port ${port}`);
});
