// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const util = require('../util');
const constants = require('./constants');
const RobotInterface = require('./interface/robotinterface');
const Packet = require('./interface/packet');
const types = require('./interface/types');

function setDriveVelocity(left, right) {
  RobotInterface.writePacket(new Packet(types.CmdTypeSetDriveClosedLoop, [left, right]));
}

// Differential drivebase
class Drive {
  constructor() {

  }

  arcadeDrive(throttle, turn) {
    const newThrottle = util.squareAndKeepSign(throttle) * constants.MaxManualThrottle;
    const newTurn = util.squareAndKeepSign(turn) * constants.MaxManualTurn;
    setDriveVelocity(newThrottle + newTurn, newThrottle - newTurn);
  }
}

module.exports = Drive;
