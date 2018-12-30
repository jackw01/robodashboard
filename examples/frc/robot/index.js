// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

const EventEmitter = require('events');
const dgram = require('dgram');

const { logger, LocationValue } = require('../../../server');

// Main robot controller
class Robot extends EventEmitter {
  constructor() {
    super();

    this.socket = dgram.createSocket('udp4');

    this.socket.on('listening', () => {
      const address = this.socket.address();
      logger.info(`Dashboard UDP socket open on ${address.address}:${address.port}`);
    });

    // UDP message handler
    this.socket.on('message', (msg) => {
      console.log(msg);
      console.log(msg.readUIntBE(2, 6));
      /*
      const obj = JSON.parse(msg.toString());
      if (obj[0] === 'log') { // If message is a log entry from the roborio, handle it properly
        logger.robot(obj[1]);
      } else { // For all other cases, emit the telemetry event and let the dashboard handle it
        this.emit('telemetry', obj[0], obj[1]);
      }*/
    });

    this.socket.on('error', (err) => {
      logger.info(`Dashboard UDP socket error:\n${err.stack}`);
    });

    this.socket.bind(5800);
  }
}

module.exports = Robot;
