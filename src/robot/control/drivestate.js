// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

class DriveState {
  constructor(leftVelocity, rightVelocity, finished) {
    this.leftVelocity = leftVelocity;
    this.rightVelocity = rightVelocity;
    this.finished = finished;
  }
}

module.exports = DriveState;
