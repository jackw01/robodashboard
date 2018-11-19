// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Represents a telemetry data point
class DataPoint {
  constructor(key, description, updateIntervalMs, historyLengthS, options) {
    this.key = key;
    this.description = description;
    this.updateIntervalMs = updateIntervalMs;
    this.historyLengthS = historyLengthS;
    Object.assign(this, { isSampled: false }, options);
    this.value = 0;
    this.lastUpdated = 0;
  }
}

module.exports = DataPoint;
