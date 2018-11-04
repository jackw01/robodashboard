// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const SerialPort = require('serialport');
const logger = require('./logger');

const port = 'COM3'; // '/dev/ttyAMA0';
const baudRate = 115200;

class RobotInterface {
  constructor() {
    this.serialBuffer = '';
    this.packetBuffer = [];
    this.serial = new SerialPort(port, { baudRate }, (err) => {
      if (err) logger.error(err);
      else logger.info('Serial port connected.');
    });
  }
}

module.exports = new RobotInterface();
