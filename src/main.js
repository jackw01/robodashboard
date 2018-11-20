// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const Dashboard = require('./dashboard');
const DataPoint = require('./dashboard/datapoint');
const Robot = require('./robot');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDataPoints([
  new DataPoint('batteryVoltage', 'Battery Voltage (V)', 1000, 60, {
    range: [3, 7.2],
  }),
  new DataPoint('gyroAngle', 'Gyro Relative Angle', 100, 1, {
    isSampled: true,
    subKeys: ['roll', 'pitch', 'heading'],
  }),
  new DataPoint('driveEncoderDistance', 'Drive Distance (mm)', 100, 1, {
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DataPoint('driveEncoderVelocity', 'Drive Surface Velocity (mm/s)', 100, 1, {
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DataPoint('driveOutput', 'Drive Output Power (%)', 100, 1, {
    range: [0, 1],
    isSampled: true,
    subKeys: ['left', 'right'],
  }),
  new DataPoint('avrFreeRAM', 'AVR Free RAM (B)', 1000, 60, {
  }),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDataPoint.bind(dashboard.telemetryServer));
