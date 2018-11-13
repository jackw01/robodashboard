// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const Dashboard = require('./dashboard');
const DataPoint = require('./dashboard/datapoint');
const Robot = require('./robot');

const dashboard = new Dashboard();
const robot = new Robot();

dashboard.telemetryServer.registerDataPoints([
  new DataPoint('batteryVoltage', false),
  new DataPoint('gyroAngle', true, 100),
  new DataPoint('driveEncoderDistance', true, 100),
  new DataPoint('driveErrorLeft', true, 100),
  new DataPoint('driveErrorRight', true, 100),
  new DataPoint('driveOutputLeft', true, 100),
  new DataPoint('driveOutputRight', true, 100),
  new DataPoint('avrFreeRAM', false),
]);

robot.on('telemetry', dashboard.telemetryServer.setValueForDataPoint);
