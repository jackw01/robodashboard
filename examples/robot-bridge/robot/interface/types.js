// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

module.exports = Object.freeze({
  DataTypeHumanReadable: 0,
  DataTypeBatteryVoltage: 1,
  DataTypeGyro: 2,
  DataTypeDriveDistance: 3,
  DataTypeDriveControlData: 4,
  DataTypeFreeRAM: 5,
  CmdTypeSetDriveOpenLoop: 0,
  CmdTypeSetDriveClosedLoop: 1,
  CmdTypeEnableDriveClosedLoop: 2,
  CmdTypeDisableDriveClosedLoop: 3,
  CmdTypeSetDrivePIDTuning: 4,
  CmdTypeSetAllStatusLEDs: 5,
  CmdTypeCalibrateGyro: 6,
  CmdTypeResetDrive: 7,
});
