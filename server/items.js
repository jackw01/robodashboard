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
  StaticText: 'staticText',
  Numeric: 'numeric',
  Location: 'location',
  Log: 'log',
  State: 'state',
  ButtonGroup: 'buttonGroup',
  InputGroup: 'inputGroup',
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

class DashboardItemInput {
  constructor(label, min, max, step, defaultValue) {
    this.label = label;
    this.min = min;
    this.max = max;
    this.step = step;
    this.default = defaultValue;
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
      unitSymbol: '', // Symbol for measurement unit
      showGraph: false, // If true, graph will be displayed on web dashboard
      isSampled: false, // If true, the value of the data point will be sent to the dashboard at a preset interval
      updateIntervalMs: 1000, // Update interval, if sampled
      historyLengthS: 60, // Default time period of graph
      subKeys: [], // If the data point is an object containing multiple values, these are the expected keys
      createControl: false, // If true, dashboard will show a control for editing the value

      // Type: State
      states: {}, // Object containing DashboardItemStates for each key
      defaultState: true, // Default state key
      isSecondaryState: false, // Primary or secondary?

      // Type: ButtonGroup, InputGroup
      controls: {}, // Object containing DashboardItemControls/Inputs for each key

      // Type: StaticText
      text: '',
    }, options);

    if (this.subKeys.length) {
      this.value = {};
      this.subKeys.forEach((k) => { this.value[k] = 0; });
    } else this.value = 0;

    this.timestamp = 0;
    this.lastUpdated = 0;
  }
}

class LocationValue {
  constructor(transform, rawHeading, reset) {
    this.transform = transform;
    this.rawHeading = rawHeading;
    this.reset = reset;
  }
}

module.exports = {
  DashboardTypes,
  DashboardItemState,
  DashboardItemControl,
  DashboardItemInput,
  DashboardItem,
  LocationValue,
};
