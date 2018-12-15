// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const { logger } = require('../../../server');

const EventEmitter = require('events');
const { LocationValue } = require('../../../server');
const types = require('./interface/types');
const Packet = require('./interface/packet');
const robotInterface = require('./interface/robotinterface');
const positionTracker = require('./positiontracker');
const Drive = require('./drive');

function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

// Main robot controller
class Robot extends EventEmitter {
  constructor() {
    super();
    this.drive = new Drive();

    // Ping message to let dashboard know if the server is receiving data
    robotInterface.on('receivingData', (state) => {
      this.emit('telemetry', 'receivingData', state ? 'receivingData' : 'notReceivingData');
      if (state) logger.info('Receiving data from robot.');
      else logger.warn('Not receiving data from robot.');
    });

    // Event handler for packets
    robotInterface.on('data', (packets) => {
      packets.forEach((p) => {
        if (p.type === types.DataTypeHumanReadable) {
          logger.robot(p.contents[0]);
          //this.emit('telemetry', 'log', p.contents[0]);
        } else if (p.type === types.DataTypeBatteryVoltage) {
          this.emit('telemetry', 'batteryVoltage', p.contents[0]);
        } else if (p.type === types.DataTypeGyro) { // Update position tracker with gyro data and last distance
          if (this.lastDistance) {
            positionTracker.calculate(this.lastDistance[0], this.lastDistance[1], -p.contents[2]);
            delete this.lastDistance;
            this.emit('telemetry', 'location',
              new LocationValue(positionTracker.getCurrentOdometry(), -p.contents[2], positionTracker.getReset()));
          }
          this.emit('telemetry', 'gyroAngle', {
            roll: radToDeg(p.contents[0]),
            pitch: radToDeg(p.contents[1]),
            heading: -radToDeg(p.contents[2]),
          });
        } else if (p.type === types.DataTypeDriveDistance) { // Save drive distance packet to buffer
          this.lastDistance = p.contents;
          this.emit('telemetry', 'driveEncoderDistance', { left: p.contents[0], right: p.contents[1] });
        } else if (p.type === types.DataTypeDriveControlData) {
          this.emit('telemetry', 'driveEncoderVelocity', { left: p.contents[2], right: p.contents[3] });
          this.emit('telemetry', 'driveOutput', { left: p.contents[4], right: p.contents[5] });
        } else if (p.type === types.DataTypeFreeRAM) {
          this.emit('telemetry', 'avrFreeRAM', p.contents[0]);
        }
      });
    });
  }

  resetOdometry() {
    robotInterface.writePacket(new Packet(types.CmdTypeResetDrive, 1));
    positionTracker.resetOdometry();
  }

  calibrateGyro() {
    robotInterface.writePacket(new Packet(types.CmdTypeCalibrateGyro, 500));
  }

  update() {
    this.drive.update();
  }
}

module.exports = Robot;
