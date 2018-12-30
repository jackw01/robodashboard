// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

const EventEmitter = require('events');
const dgram = require('dgram');
const chalk = require('chalk');
const prettyMs = require('pretty-ms');

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
      const timestamp = msg.readUIntLE(0, 6);
      const key = msg.toString('utf8', 6, 10).trim();
      const value = msg.toString('utf8', 10);

      if (key === 'log') { // If message is a log entry from the roborio, handle it properly
        const latency = Date.now() - timestamp;
        const valueString = `${chalk.cyan('robot')}: ${value}`;
        this.emit('telemetry', 'log', valueString, timestamp);
        this.emit('telemetry', 'latency', latency);
        console.log(`${new Date(timestamp).toISOString()} ${valueString} [latency: ${prettyMs(latency)}]`);
      } else { // For all other cases, emit the telemetry event and let the dashboard handle it
        this.emit('telemetry', key, value, timestamp);
      }
    });

    this.socket.on('error', (err) => {
      logger.info(`Dashboard UDP socket error:\n${err.stack}`);
    });

    this.socket.bind(5800);
  }
}

module.exports = Robot;
