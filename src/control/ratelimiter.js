// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const transform = require('./transform');

class RateLimiter {
  constructor(accelLimit, jerkLimit) {
    this.accelLimit = accelLimit;
    this.jerkLimit = jerkLimit;
  }

  calculate(setpoint) {

  }
}

module.exports = RateLimiter;
