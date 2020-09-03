// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

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
    text: 'Interface: robot-bridge',
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
  new DashboardItem(DashboardTypes.ButtonGroup, 'resetOdometry', {
    controls: {
      resetOdometry: new DashboardItemControl('Reset Odometry', 'primary'),
    },
  }),
  new DashboardItem(DashboardTypes.InputGroup, 'ledColor', {
    description: 'LED Color',
    controls: {
      r: new DashboardItemInput('R', 0, 255, 1, 0),
      g: new DashboardItemInput('G', 0, 255, 1, 64),
      b: new DashboardItemInput('B', 0, 255, 1, 64),
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
    range: [0, 7.2],
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
  new DashboardItem(DashboardTypes.Numeric, 'avrFreeRAM', {
    description: 'AVR Free RAM',
    unitSymbol: 'B',
    showGraph: true,
    updateIntervalMs: 1000,
    historyLengthS: 60,
  }),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDashboardItem.bind(dashboard.telemetryServer));

dashboard.telemetryServer.on('controlClick', (key) => {
  logger.info(`Dashboard control clicked: ${key}`);
  if (key === 'calibrateGyro') robot.calibrateGyro();
  else if (key === 'resetOdometry') robot.resetOdometry();
  else if (key === 'disabled') robot.drive.disable();
  else if (key === 'enabled') robot.drive.enable();
});

dashboard.telemetryServer.on('inputChange', (key, value) => {
  logger.info(`Dashboard input changed: {${key}: ${value}}`);
  if (key === 'r') robot.setLEDColor({ r: value });
  else if (key === 'g') robot.setLEDColor({ g: value });
  else if (key === 'b') robot.setLEDColor({ b: value });
});