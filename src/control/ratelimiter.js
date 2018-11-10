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
    const dInput = input - this.lastInput; // Expected deltaVelocity
    // Area under triangle at end of trapezoidal motion profile
    // Represents velocity change in the time it takes to reach zero acceleration under current accel and jerk values
    // dV = a*t // Change in velocity = accel * time
    // j = a/t // Jerk is rate in change in acceleration over time
    // t = a/j // Time to reach acceleration a with jerk j
    // dV = a^2 / j
    const area = (this.currentAccel ** 2) / this.jerkLimit;

    // If expected change in velocity is greater than achieveable with current acceleration, increase acceleration
    // If the expected change in velocity cannot be achieved in time, decrease acceleration
    const dAccel = Math.sign(dInput) * this.jerkLimit * dT;
    if (Math.abs(dInput) >= area || Math.sign(dInput) !== Math.sign(this.currentAccel)) this.currentAccel += dAccel;
    else this.currentAccel -= dAccel;

    this.currentAccel = util.clamp(this.currentAccel, -this.accelLimit, this.accelLimit); // Limit acceleration
    this.lastInput += this.currentAccel * dT; // Integrate acceleration into velocity
    if (Math.sign(input - this.lastInput) !== Math.sign(dInput)) { // Cap velocity at the target value
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
