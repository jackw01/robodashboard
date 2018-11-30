// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

module.exports = Object.freeze({
  Port: 'COM3', // '/dev/ttyAMA0';
  BaudRate: 115200,
  PacketMarker: '\\',
  PacketSeparator: ' ',
  TrackDiameter: 86, // mm
  DriveVelocityDeadband: 50, // mm/s
  DriveAccel: 100, // mm/s^2
  DriveJerk: Number.MAX_VALUE, // mm/s^3
  MaxManualThrottle: 500,
  MaxManualTurn: 300,
});
