// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2019 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

const EventEmitter = require('events');
const dgram = require('dgram');
const chalk = require('chalk');

const { logger, LocationValue } = require('../../../server');

// Main robot controller
class Robot extends EventEmitter {
  constructor() {
    super();
    this.dashboardSubKeys = {};
    this.lastLatencyCheck = 0;

    this.socket = dgram.createSocket('udp4');

    this.socket.on('listening', () => {
      const address = this.socket.address();
      logger.info(`Dashboard UDP socket open on ${address.address}:${address.port}`);
    });

    // UDP message handler
    this.socket.on('message', (msg) => {
      const timestamp = msg.readUIntLE(0, 6);
      const key = msg.toString('utf8', 6, 10).trim();

      // Check data latency
      const now = Date.now();
      if (now - this.lastLatencyCheck > 1000) {
        this.lastLatencyCheck = now;
        this.emit('telemetry', 'latency', now - timestamp);
      }

      if (key === 'log') { // If message is a log entry from the roborio, handle it properly
        const valueString = `${chalk.cyan('robot')}: ${msg.toString('utf8', 10)}`;
        this.emit('telemetry', 'log', valueString, timestamp);
        console.log(`${new Date(timestamp).toISOString()} ${valueString}`);
      } else { // For all other cases, emit the telemetry event and let the dashboard handle it
        const values = [];
        for (let i = 10; i < msg.length; i += 8) values.push(msg.readDoubleLE(i));
        if (values.length === 1) this.emit('telemetry', key, values[0], timestamp);
        else {
          const data = {};
          values.forEach((v, i) => { data[this.dashboardSubKeys[key][i]] = v; });
          this.emit('telemetry', key, data, timestamp);
        }
      }
    });

    this.socket.on('error', (err) => {
      logger.info(`Dashboard UDP socket error:\n${err.stack}`);
    });

    this.socket.bind(5800);
  }

  registerDashboardItems(items) {
    items.forEach((p) => { this.dashboardSubKeys[p.key] = p.subKeys; });
  }
}

module.exports = Robot;
