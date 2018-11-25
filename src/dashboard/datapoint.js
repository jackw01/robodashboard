// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Represents a telemetry data point
class DataPoint {
  constructor(key, description, options) {
    this.key = key;
    this.description = description;
    Object.assign(this, {
      graph: true,
      allowEditing: false,
      isState: false,
      defaultState: true,
      stateColors: {},
      updateIntervalMs: 1000,
      historyLengthS: 60,
      isSampled: false,
      subKeys: [],
    }, options);
    this.value = 0;
    this.lastUpdated = 0;
  }
}

module.exports = DataPoint;
