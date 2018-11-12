// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const pkg = require('../../package.json');
const logger = require('../logger');
const TelemetryServer = require('./telemetryserver');

const defaults = Object.freeze({
  telemetryServerPort: 8080,
});

// Dashboard
class Dashboard {
  constructor(options) {
    logger.info(`RoboDashboard v${pkg.version}`);
    this.options = Object.assign({}, defaults, options);
    this.telemetryServer = new TelemetryServer(this.options.telemetryServerPort);
  }
}

module.exports = Dashboard;
