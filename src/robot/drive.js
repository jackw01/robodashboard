// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const util = require('../util');
const constants = require('./constants');
const positionTracker = require('./positiontracker');
const RobotInterface = require('./interface/robotinterface');
const Packet = require('./interface/packet');
const types = require('./interface/types');
const DriveState = require('./control/drivestate');
const PurePursuitController = require('./control/purepursuitcontroller');

function sendDriveVelocity(left, right) {
  RobotInterface.writePacket(new Packet(types.CmdTypeSetDriveClosedLoop, [left, right]));
}

// Differential drivebase
class Drive {
  constructor() {
    this.pathFollower = new PurePursuitController();
    this.autonomousMode = false;
  }

  arcadeDrive(throttle, turn) {
    const newThrottle = util.squareAndKeepSign(throttle) * constants.MaxManualThrottle;
    const newTurn = util.squareAndKeepSign(turn) * constants.MaxManualTurn;
    this.driveState = new DriveState(newThrottle + newTurn, newThrottle - newTurn, false);
  }

  update() {
    if (this.autonomousMode) {
      this.driveState = this.pathFollower.calculate(positionTracker.getCurrentOdometry());
    }
    if (this.driveState.finished) {
      this.autonomousMode = false;
      sendDriveVelocity(0, 0);
    } else {
      sendDriveVelocity(this.driveState.leftVelocity, this.driveState.rightVelocity);
    }
  }
}

module.exports = new Drive();
