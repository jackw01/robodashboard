// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const WebSocket = require('ws');
const logger = require('../logger');

// Collects telemetry data for logging and displaying
class TelemetryServer {
  constructor(port) {
    this.dataPoints = {};
    this.active = false;

    // Server
    logger.info('Starting telemetry server...');
    this.wss = new WebSocket.Server({ port });
    this.wss.on('connection', (ws) => {
      logger.info('Telemetry server connected to client.');
      this.active = true;
      this.ws = ws;

      // Event handlers
      ws.on('error', (err) => {
        logger.error(`Telemetry server socket error: ${err.message}`);
      });

      ws.on('close', (code, reason) => {
        logger.info(`Telemetry server socket closed: ${reason}`);
        this.active = false;
      });
    });

    this.wss.on('error', (err) => {
      logger.error(`Telemetry server error: ${err.message}`);
    });
  }

  registerDataPoints(dataPoints) {
    dataPoints.forEach((p) => { this.dataPoints[p.key] = p; });
    const interval = Math.min(...(dataPoints.map(p => p.updateIntervalMs)));
    this.updateInterval = setInterval(this.update.bind(this), interval);
  }

  setValueForDataPoint(key, value) {
    // If the value is not meant to be sampled at a regular interval, send it now
    if (this.active && !this.dataPoints[key].isSampled) this.ws.send(JSON.stringify({ key: value }), () => {});
    this.dataPoints[key].value = value;
  }

  update() {
    if (this.dataPoints) {
      const now = new Date();
      const newData = {};
      Object.entries(this.dataPoints).forEach(([key, dataPoint]) => {
        if (now - dataPoint.lastUpdated > dataPoint.updateIntervalMs) {
          this.dataPoints[key].lastUpdated = now;
          newData[key] = dataPoint.value;
        }
      });
      if (Object.entries(newData).length > 0) {
        const str = JSON.stringify(newData);
        logger.debug(str);
        if (this.active) this.ws.send(str, () => {});
      }
    }
  }
}

module.exports = TelemetryServer;
