// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const Dashboard = require('./dashboard');
const DashboardItem = require('./dashboard/dashboarditem');
const DashboardTypes = require('./dashboard/dashboardtypes');
const Robot = require('./robot');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDashboardItems([
  new DashboardItem(DashboardTypes.State, 'mode', 'Mode', {
    allowEditing: true,
    defaultState: 'Disabled',
    stateColors: { Enabled: 'primary', Disabled: 'warning' },
  }),
  new DashboardItem(DashboardTypes.Numeric, 'batteryVoltage', 'Battery Voltage (V)', {
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
    range: [3, 7.2],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'gyroAngle', 'Gyro Relative Angle', {
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['roll', 'pitch', 'heading'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveEncoderDistance', 'Drive Distance (mm)', {
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveEncoderVelocity', 'Drive Surface Velocity (mm/s)', {
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveOutput', 'Drive Output Power (%)', {
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    range: [0, 1],
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'avrFreeRAM', 'AVR Free RAM (B)', {
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
  }),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));
