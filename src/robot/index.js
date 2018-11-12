// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const types = require('./interface/types');
const robotInterface = require('./interface/robotinterface');
const positionTracker = require('./positiontracker');
const drive = require('./drive');

// Main robot controller
class Robot {
  constructor() {
    // Event handler for packets
    robotInterface.on('data', (packets) => {
      packets.forEach((p) => {
        if (p.type === types.DataTypeDriveDistance) { // Save drive distance packet to buffer
          this.lastDistance = p.contents;
        } else if (p.type === types.DataTypeGyro) { // Update position tracker with gyro data and last distance
          if (this.lastDistance) positionTracker.calculate(this.lastDistance[0], this.lastDistance[1], p.contents[2]);
        }
      });
    });
  }

  update() {
    drive.update();
  }
}

module.exports = Robot;
