const express = require('express');

const Router = express.Router();

Router.route('/').get((req, res) => {
  res.send(`
    <div style=text-align:center>
    <h1>Welcome to PantoWeb</h1>
    <p>Version 0.1 - beta</p>
    </div>
    `);
});

module.exports = Router;
