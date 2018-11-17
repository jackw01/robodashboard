// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Represents a telemetry data point
class DataPoint {
  constructor(key, description, isSampled, updateIntervalMs) {
    this.key = key;
    this.description = description;
    this.isSampled = isSampled;
    if (isSampled) this.updateIntervalMs = updateIntervalMs;
    this.value = 0;
    this.lastUpdated = 0;
  }
}

module.exports = DataPoint;
