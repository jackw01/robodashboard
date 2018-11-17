// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const WebSocket = require('ws');
const logger = require('../logger');
const DataPoint = require('./datapoint');
const SystemMonitor = require('./systemmonitor');

// Collects telemetry data for logging and displaying
class TelemetryServer {
  constructor(port) {
    this.dataPoints = {};
    this.systemMonitor = new SystemMonitor(1000);

    // Set up data points for system monitor
    [
      new DataPoint('serverFreeRAM', 'Server Free RAM (MB)', false),
      new DataPoint('serverCPUUsage', 'Server CPU Usage (%)', false),
    ].forEach((p) => { this.dataPoints[p.key] = p; });

    this.systemMonitor.on('telemetry', this.setValueForDataPoint.bind(this));

    // Server
    logger.info('Starting telemetry server...');
    this.wss = new WebSocket.Server({ port });
    this.wss.on('connection', (ws) => {
      logger.info('Telemetry server connected to client.');
      this.ws = ws;

      // Send metadata about data points to let the client know what it will recieve
      if (this.dataPoints) this.sendMetadata();
      else logger.warn('Data points not registered yet, not sending to client.');

      // Event handlers
      ws.on('error', (err) => {
        logger.error(`Telemetry server socket error: ${err.message}`);
      });

      ws.on('close', (code, reason) => {
        logger.info(`Telemetry server socket closed: ${reason}`);
      });
    });

    this.wss.on('error', (err) => {
      logger.error(`Telemetry server error: ${err.message}`);
    });
  }

  sendMetadata() {
    this.ws.send(JSON.stringify(this.dataPoints), () => {
      logger.info('Telemetry data points registered with client.');
    });
  }

  registerDataPoints(dataPoints) {
    dataPoints.forEach((p) => { this.dataPoints[p.key] = p; });
    if (this.ws) this.sendMetadata(); // Send metadata if web socket exists already (it shouldn't)
    const interval = Math.min(...(dataPoints.map(p => p.updateIntervalMs)));
    this.updateInterval = setInterval(this.update.bind(this), interval); // Set interval to send data
  }

  setValueForDataPoint(key, value) {
    // If the value is not meant to be sampled at a regular interval, send it now
    if (this.ws && !this.dataPoints[key].isSampled) {
      const obj = {};
      obj[key] = value;
      this.ws.send(JSON.stringify(obj), () => {});
    }
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
      if (Object.entries(newData).length > 0) if (this.ws) this.ws.send(JSON.stringify(newData), () => {});
    }
  }
}

module.exports = TelemetryServer;
