// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const util = require('../util');

// Limits acceleration and jerk of a changing value
class RateLimiter {
  constructor(accelLimit, jerkLimit) {
    this.accelLimit = accelLimit;
    this.jerkLimit = jerkLimit;
    this.reset();
  }

  // Calculate new target velocity based on input target velocity and dT
  calculate(input, dT) {
    const dInput = input - this.lastInput;
    const area = (this.currentAccel ** 2) / this.jerkLimit;
    const dAccel = Math.sign(dInput) * this.jerkLimit * dT;
    if (Math.abs(dInput) >= area || Math.sign(dInput) !== Math.sign(this.currentAccel)) this.currentAccel += dAccel;
    else this.currentAccel -= dAccel;
    this.currentAccel = util.clamp(this.currentAccel, -this.accelLimit, this.accelLimit);
    this.lastInput += this.currentAccel * dT;
    if (Math.sign(input - this.lastInput) !== Math.sign(dInput)) {
      this.lastInput = input;
      this.currentAccel = 0;
    }
    return this.lastInput;
  }

  reset() {
    this.lastInput = 0;
    this.currentAccel = 0;
  }
}

module.exports = RateLimiter;
