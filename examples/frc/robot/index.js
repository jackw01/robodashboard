// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

const EventEmitter = require('events');

const { logger, LocationValue } = require('../../../server');

// Main robot controller
class Robot extends EventEmitter {
  constructor() {
    super();

  }

  update() {

  }
}

module.exports = Robot;
