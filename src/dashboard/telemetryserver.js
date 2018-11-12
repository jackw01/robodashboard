// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const WebSocket = require('ws');
const logger = require('../logger');

// Collects telemetry data for logging and displaying
class TelemetryServer {
  constructor(port) {
    this.currentData = {};
    this.historicalData = [];

    // Server
    logger.info('Starting telemetry server...');
    this.wss = new WebSocket.Server({ port });
    this.wss.on('connection', (ws) => {
      logger.info('Telemetry server connected to client.');
    });
  }

  setValueForKey(key, value) {
    this.currentData[key] = value;
  }
}

module.exports = TelemetryServer;
