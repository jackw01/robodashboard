// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const EventEmitter = require('events');
const types = require('./interface/types');
const robotInterface = require('./interface/robotinterface');
const positionTracker = require('./positiontracker');
const Drive = require('./drive');

// Main robot controller
class Robot extends EventEmitter {
  constructor() {
    super();
    this.drive = new Drive();
    this.robotInterface = robotInterface;

    // Event handler for packets
    robotInterface.on('data', (packets) => {
      packets.forEach((p) => {
        if (p.type === types.DataTypeBatteryVoltage) { // Send
          this.emit('telemetry', 'batteryVoltage', p.contents);
        } else if (p.type === types.DataTypeDriveDistance) { // Save drive distance packet to buffer
          this.lastDistance = p.contents;
          this.emit('telemetry', 'driveEncoderDistance', { left: p.contents[0], right: p.contents[1] });
        } else if (p.type === types.DataTypeGyro) { // Update position tracker with gyro data and last distance
          if (this.lastDistance) positionTracker.calculate(this.lastDistance[0], this.lastDistance[1], p.contents[2]);
          this.emit('telemetry', 'gyroAngle', { roll: p.contents[0], pitch: p.contents[1], heading: p.contents[2] });
        }
      });
    });
  }

  update() {
    this.drive.update();
  }
}

module.exports = Robot;
