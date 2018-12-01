// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Types:
// Numeric - numeric or object with numeric values for each key
//   subKeys is an array of possible keys in an object
//
// State - string
//
// ButtonGroup - button group

const DashboardTypes = Object.freeze({
  Numeric: 'numeric',
  State: 'state',
  ButtonGroup: 'buttonGroup',
});

class DashboardItemState {
  constructor(label, controlColor, controlLabel) {
    this.label = label;
    this.controlColor = controlColor || 'primary';
    this.controlLabel = controlLabel || '';
  }
}

class DashboardItemControl {
  constructor(label, color) {
    this.label = label;
    this.color = color;
  }
}

// Represents a telemetry data point, status item, or other value or control
class DashboardItem {
  constructor(type, key, options) {
    this.type = type;
    this.key = key;

    // All possible options depending on type
    Object.assign(this, {
      description: '', // User-facing description text
      showGraph: false, // If true, graph will be displayed on web dashboard
      isSampled: false, // If true, the value of the data point will be sent to the dashboard at a preset interval
      updateIntervalMs: 1000, // Update interval, if sampled
      historyLengthS: 60, // Default time period of graph
      subKeys: [], // If the data point is an object containing multiple values, these are the expected keys
      createControl: false, // If true, dashboard will show a control for editing the value

      // Type: State
      states: {}, // Object containing DashboardItemStates for each key
      defaultState: true, // Default state key

      // Type: ButtonGroup
      controls: {}, // Object containing DashboardItemControls for each key
    }, options);

    this.value = 0;
    this.timestamp = 0;
    this.lastUpdated = 0;
  }
}

module.exports = {
  DashboardTypes,
  DashboardItemState,
  DashboardItemControl,
  DashboardItem,
};