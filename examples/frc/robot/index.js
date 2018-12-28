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

    this.socket.on('message', (msg, rinfo) => {
      logger.info(`Dashboard UDP socket received ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    this.socket.on('error', (err) => {
      logger.info(`Dashboard UDP socket error:\n${err.stack}`);
    });

    this.socket.bind(5800);
  }

  update() {

  }
}

module.exports = Robot;
