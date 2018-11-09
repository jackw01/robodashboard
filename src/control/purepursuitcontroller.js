// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const transform = require('./transform');

class PurePursuitController {
  constructor() {
  }

  setPath(newPath) {
    this.path = newPath;
  }

  setMaxSpeed(speed) {
    this.maxSpeed = speed;
  }

  setDynamicLookAheadDistance(minDistance, maxDistance, minSpeed, maxSpeed) {
    this.minLookAheadDistance = minDistance;
    this.maxLookAheadDistance = maxDistance;
    this.minLookAheadDistanceSpeed = minSpeed;
    this.maxLookAheadDistanceSpeed = maxSpeed;
    this.lookAheadDistance = minDistance;
  }
}

module.exports = PurePursuitController;
