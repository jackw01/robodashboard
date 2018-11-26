// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const WebSocket = require('ws');
const logger = require('../logger');
const { DashboardTypes, DashboardItem } = require('./items');
const SystemMonitor = require('./systemmonitor');

// Collects telemetry data for logging and displaying
class TelemetryServer {
  constructor(port) {
    this.items = {};
    this.systemMonitor = new SystemMonitor(1000);

    // Set up data points for system monitor
    [
      new DashboardItem(DashboardTypes.Numeric, 'serverFreeRAM', {
        description: 'Server Free RAM (MB)',
        showGraph: true,
        updateIntervalMs: 1000,
        historyLengthS: 60,
      }),
      new DashboardItem(DashboardTypes.Numeric, 'serverCPUUsage', {
        description: 'Server CPU Usage (%)',
        showGraph: true,
        updateIntervalMs: 1000,
        historyLengthS: 60,
        range: [0, 100],
      }),
    ].forEach((p) => { this.items[p.key] = p; });

    this.systemMonitor.on('telemetry', this.setValueForDashboardItem.bind(this));

    // Server
    logger.info('Starting telemetry server...');
    this.wss = new WebSocket.Server({ port });
    this.wss.on('connection', (ws) => {
      logger.info('Telemetry server connected to client.');
      this.ws = ws;

      // Send metadata about data points to let the client know what it will recieve
      if (this.items) this.sendMetadata();
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
    this.ws.send(JSON.stringify(this.items), () => {
      logger.info('Telemetry data points registered with client.');
    });
  }

  registerDashboardItems(items) {
    items.forEach((p) => { this.items[p.key] = p; });
    if (this.ws) this.sendMetadata(); // Send metadata if web socket exists already (it shouldn't)
    const interval = Math.min(...(items.map(p => p.updateIntervalMs)));
    this.updateInterval = setInterval(this.update.bind(this), interval); // Set interval to send data
  }

  setValueForDashboardItem(key, value) {
    // If the value is not meant to be sampled at a regular interval, send it now
    if (this.ws && !this.items[key].isSampled) {
      const obj = {};
      obj[key] = value;
      this.ws.send(JSON.stringify(obj), () => {});
    }
    this.items[key].value = value;
  }

  update() {
    if (this.items) {
      const now = new Date();
      const newData = {};
      Object.entries(this.items).forEach(([key, dataPoint]) => {
        if (this.items[key].isSampled && now - dataPoint.lastUpdated > dataPoint.updateIntervalMs) {
          this.items[key].lastUpdated = now;
          newData[key] = dataPoint.value;
        }
      });
      if (Object.entries(newData).length > 0) if (this.ws) this.ws.send(JSON.stringify(newData), () => {});
    }
  }
}

module.exports = TelemetryServer;
