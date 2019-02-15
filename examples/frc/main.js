// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2019 jackw01. Released under the MIT License (see LICENSE for details).
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
      enabled: new DashboardItemState('Enabled', 'primary'),
      disabled: new DashboardItemState('Disabled', 'warning'),
    },
  }),
  new DashboardItem(DashboardTypes.Location, 'loc', {
  }),
  new DashboardItem(DashboardTypes.Log, 'log', {
  }),
  new DashboardItem(DashboardTypes.Numeric, 'latency', {
    description: 'Connection Latency',
    unitSymbol: 'ms',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
  }),
  new DashboardItem(DashboardTypes.Numeric, 'vBat', {
    description: 'Battery Voltage',
    unitSymbol: 'V',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
    range: [0, 14],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'aAbs', {
    description: 'Gyro Relative Angle',
    unitSymbol: '°',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['roll', 'pitch', 'heading'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'drvD', {
    description: 'Drive Distance',
    unitSymbol: 'mm',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'drvV', {
    description: 'Drive Surface Velocity',
    unitSymbol: 'mm/s',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'drvP', {
    description: 'Drive Output Power',
    unitSymbol: '%',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 5,
    range: [0, 1],
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'trtL', {
    description: 'Turret Control Loop',
    unitSymbol: '°',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 30,
    range: [0, 360],
    isSampled: true,
    subKeys: ['setpoint', 'position'],
  }),
  new DashboardItem(DashboardTypes.Numeric, 'elvL', {
    description: 'Elevator Control Loop',
    unitSymbol: 'in',
    showGraph: true,
    updateIntervalMs: 100,
    historyLengthS: 30,
    range: [0, 100],
    isSampled: true,
    subKeys: ['setpoint', 'position'],
  }),
  new DashboardItem(DashboardTypes.State, 'sArm', {
    description: 'Arm',
    defaultState: 'retract',
    states: {
      retract: new DashboardItemState('Retracted', 'secondary'),
      extend: new DashboardItemState('Extended', 'primary'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'sIB1', {
    description: 'Ball Intake',
    defaultState: 'stow',
    states: {
      stow: new DashboardItemState('Stowed', 'secondary'),
      deploy: new DashboardItemState('Deployed', 'primary'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'sIB2', {
    description: 'Ball Intake',
    defaultState: 'off',
    states: {
      off: new DashboardItemState('Off', 'secondary'),
      intake: new DashboardItemState('Intaking', 'primary'),
      eject: new DashboardItemState('Ejecting', 'warning'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'sIH1', {
    description: 'Hatch Intake',
    defaultState: 'stow',
    states: {
      stow: new DashboardItemState('Stowed', 'secondary'),
      handoff: new DashboardItemState('Handoff', 'warning'),
      intake: new DashboardItemState('Intake', 'primary'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'sIH2', {
    description: 'Hatch Intake',
    defaultState: 'off',
    states: {
      off: new DashboardItemState('Off', 'secondary'),
      intake: new DashboardItemState('Intaking', 'primary'),
      eject: new DashboardItemState('Ejecting', 'warning'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'sMnM', {
    description: 'Manipulator Gripper',
    defaultState: 'hatch',
    states: {
      hatch: new DashboardItemState('Hatch', 'primary'),
      ball: new DashboardItemState('Ball', 'primary'),
    },
  }),
  new DashboardItem(DashboardTypes.State, 'sMnI', {
    description: 'Manipulator Wheels',
    defaultState: 'off',
    states: {
      off: new DashboardItemState('Off', 'secondary'),
      intake: new DashboardItemState('Intaking', 'primary'),
      eject: new DashboardItemState('Ejecting', 'warning'),
    },
  }),
];

dashboard.telemetryServer.registerDashboardItems(dashboardItems);
robot.registerDashboardItems(dashboardItems);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));
