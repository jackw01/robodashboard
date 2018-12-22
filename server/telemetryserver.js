// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const pkg = require('../package.json');
const EventEmitter = require('events');
const WebSocket = require('ws');
const { LEVEL, MESSAGE } = require('triple-beam');
const logger = require('./logger');
const { DashboardTypes, DashboardItem } = require('./items');
const SystemMonitor = require('./systemmonitor');

// Collects telemetry data for logging and displaying
class TelemetryServer extends EventEmitter {
  constructor(port) {
    super();
    this.items = {};
    this.systemMonitor = new SystemMonitor(1000);

    // Set up data points for system monitor and log
    [
      new DashboardItem(DashboardTypes.Numeric, 'serverFreeRAM', {
        description: 'Server Free RAM',
        unitSymbol: 'MB',
        showGraph: true,
        updateIntervalMs: 1000,
        historyLengthS: 60,
      }),
      new DashboardItem(DashboardTypes.Numeric, 'serverCPUUsage', {
        description: 'Server CPU Usage',
        unitSymbol: '%',
        showGraph: true,
        updateIntervalMs: 1000,
        historyLengthS: 60,
        range: [0, 100],
      }),
      new DashboardItem(DashboardTypes.Log, 'serverLog', {
      }),
      new DashboardItem(DashboardTypes.StaticText, 'versionInfo', {
        text: `Version: v${pkg.version} ${pkg.date}`,
      }),
    ].forEach((p) => { this.items[p.key] = p; });

    this.systemMonitor.on('telemetry', this.setValueForDashboardItem.bind(this));

    logger.transport.on('logged', (info) => {
      this.setValueForDashboardItem('serverLog', `${info[MESSAGE].replace(info.timestamp, '')}`);
    });

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
      ws.on('message', this.messageHandler.bind(this));

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

  setValueForDashboardItem(key, value, timestampIn) {
    const timestamp = timestampIn || Date.now(); // Get timestamp
    // If the value is not meant to be sampled at a regular interval, send it now
    if (this.ws && !this.items[key].isSampled) {
      const obj = {};
      obj[key] = { value, timestamp };
      this.ws.send(JSON.stringify(obj), () => {});
    }
    this.items[key].value = value;
    this.items[key].timestamp = timestamp;
  }

  messageHandler(message) {
    const obj = JSON.parse(message);
    if (obj.type === 'controlClick') {
      this.emit('controlClick', obj.key);
    }
  }

  update() {
    if (this.items) { // Sample values of any data points with a set sample interval
      const now = new Date();
      const newData = {};
      Object.entries(this.items).forEach(([key, dataPoint]) => {
        if (dataPoint.isSampled && now - dataPoint.lastUpdated > dataPoint.updateIntervalMs) {
          this.items[key].lastUpdated = now;
          newData[key] = { value: dataPoint.value, timestamp: dataPoint.timestamp };
        }
      });
      if (Object.entries(newData).length > 0) if (this.ws) this.ws.send(JSON.stringify(newData), () => {});
    }
  }
}

module.exports = TelemetryServer;
