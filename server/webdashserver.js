// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const path = require('path');
const express = require('express');
const logger = require('./logger');

// Server for main dashboard web app
class WebDashServer {
  constructor(port) {
    // Server
    logger.info('Starting web dashboard server...');
    this.app = express();
    this.app.use(express.static(path.join(__dirname, '..', 'client/build')));
    this.app.listen(port);
  }
}

module.exports = WebDashServer;
