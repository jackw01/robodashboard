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

const dashboardItems = [
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
  new DashboardItem(DashboardTypes.Location, 'loc', {
  }),
  new DashboardItem(DashboardTypes.Log, 'log', {
    description: 'Battery Voltage',
  }),
  new DashboardItem(DashboardTypes.Numeric, 'latency', {
    description: 'Connection Latency',
    unitSymbol: 'ms',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
  }),
  new DashboardItem(DashboardTypes.Numeric, 'vbat', {
    description: 'Battery Voltage',
    unitSymbol: 'V',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
    range: [0, 14],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'aabs', {
    description: 'Gyro Relative Angle',
    unitSymbol: '°',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['roll', 'pitch', 'heading'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'ddst', {
    description: 'Drive Distance',
    unitSymbol: 'mm',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'dvel', {
    description: 'Drive Surface Velocity',
    unitSymbol: 'mm/s',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'dout', {
    description: 'Drive Output Power',
    unitSymbol: '%',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    range: [0, 1],
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
];

dashboard.telemetryServer.registerDashboardItems(dashboardItems);
robot.registerDashboardItems(dashboardItems);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));
