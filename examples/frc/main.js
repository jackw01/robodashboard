// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const {
  Dashboard,
  DashboardTypes,
  DashboardItem,
  DashboardItemState,
  DashboardItemControl,
  logger,
} = require('../../server');

const Robot = require('./robotconnector');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDashboardItems([
  new DashboardItem(DashboardTypes.State, 'receivingData', {
    description: 'Connection',
    defaultState: 'notReceivingData',
    states: {
      notReceivingData: new DashboardItemState('Not Receiving Data', 'warning'),
      receivingData: new DashboardItemState('Receiving Data', 'success'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'mode', {
    description: 'Mode',
    defaultState: 'disabled',
    states: {
      auto: new DashboardItemState('Auto', 'primary'),
      teleop: new DashboardItemState('Teleop', 'primary'),
      disabled: new DashboardItemState('Disabled', 'warning'),
    },
  }),
  new DashboardItem(DashboardTypes.Numeric, 'batteryVoltage', {
    description: 'Battery Voltage (V)',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
    range: [0, 14],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'gyroAngle', {
    description: 'Gyro Relative Angle',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['roll', 'pitch', 'heading'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveEncoderDistance', {
    description: 'Drive Distance (mm)',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveEncoderVelocity', {
    description: 'Drive Surface Velocity (mm/s)',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveOutput', {
    description: 'Drive Output Power (%)',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    range: [0, 1],
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));
