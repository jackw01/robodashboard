// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

const {
  Dashboard,
  DashboardTypes,
  DashboardItem,
  DashboardItemState,
  DashboardItemControl,
  DashboardItemInput,
  logger,
} = require('../../server');

const Robot = require('./robot');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDashboardItems([
  new DashboardItem(DashboardTypes.StaticText, 'staticText', {
    text: 'Interface: FRC Interface ',
  }),
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
      enabled: new DashboardItemState('Enabled', 'primary', 'Enable'),
      disabled: new DashboardItemState('Disabled', 'warning', 'Disable'),
    },
  }),
  new DashboardItem(DashboardTypes.Location, 'location', {
  }),
  new DashboardItem(DashboardTypes.Log, 'log', {
  }),
  new DashboardItem(DashboardTypes.Numeric, 'batteryVoltage', {
    description: 'Battery Voltage',
    unitSymbol: 'V',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
    range: [0, 14],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'gyroAngle', {
    description: 'Gyro Relative Angle',
    unitSymbol: '°',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['roll', 'pitch', 'heading'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveEncoderDistance', {
    description: 'Drive Distance',
    unitSymbol: 'mm',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveEncoderVelocity', {
    description: 'Drive Surface Velocity',
    unitSymbol: 'mm/s',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'driveOutput', {
    description: 'Drive Output Power',
    unitSymbol: '%',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    range: [0, 1],
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));
