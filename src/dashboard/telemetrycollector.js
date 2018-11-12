// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Collects telemetry data for logging and displaying
class TelemetryCollector {
  constructor() {
    this.currentData = {};
  }
}

module.exports = new TelemetryCollector();
