// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const Dashboard = require('./dashboard');
const { DashboardTypes, DashboardItem, DashboardItemState, DashboardItemControl } = require('./dashboard/items');
const Robot = require('./robot');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDashboardItems([
  new DashboardItem(DashboardTypes.State, 'mode', {
    createControl: true,
    description: 'Mode',
    defaultState: 'disabled',
    states: {
      enabled: new DashboardItemState('Enabled', 'primary', 'Enable'),
      disabled: new DashboardItemState('Disabled', 'warning', 'Disable'),
    },
  }),
  new DashboardItem(DashboardTypes.ButtonGroup, 'calibrateGyro', {
    controls: {
      calibrateGyro: new DashboardItemControl('Calibrate Gyro', 'primary'),
    },
  }),
  new DashboardItem(DashboardTypes.Numeric, 'batteryVoltage', {
    description: 'Battery Voltage (V)',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
    range: [3, 7.2],
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
  new DashboardItem(DashboardTypes.Numeric, 'avrFreeRAM', {
    description: 'AVR Free RAM (B)',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
  }),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));

dashboard.telemetryServer.on('controlClick', (key) => {
  if (key === 'calibrateGyro') robot.calibrateGyro();
});
