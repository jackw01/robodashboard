// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Represents a telemetry data point, status item, or other value or control
class DashboardItem {
  constructor(type, key, description, options) {
    this.type = type;
    this.key = key;
    this.description = description;
    Object.assign(this, {
      showGraph: false,
      updateIntervalMs: 1000,
      historyLengthS: 60,
      isSampled: false,
      subKeys: [],

      defaultState: true,
      stateColors: {},

      isEditable: false,
    }, options);
    this.value = 0;
    this.lastUpdated = 0;
  }
}

module.exports = DashboardItem;
