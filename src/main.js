// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const Dashboard = require('./dashboard');
const DataPoint = require('./dashboard/datapoint');
const Robot = require('./robot');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDataPoints([
  new DataPoint('batteryVoltage', 'Battery Voltage (V)', false),
  new DataPoint('gyroAngle', 'Gyro Relative Angle', true, 100),
  new DataPoint('driveEncoderDistance', 'Drive Distance (mm)', true, 100),
  new DataPoint('driveEncoderVelocity', 'Drive Surface Velocity (mm/s)', true, 100),
  new DataPoint('driveOutput', 'Drive Output Power (%)', true, 100),
  new DataPoint('avrFreeRAM', 'AVR Free RAM (B)', false),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDataPoint.bind(dashboard.telemetryServer));
