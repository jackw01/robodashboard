// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const util = require('../util');
const constants = require('./constants');
const transform = require('./transform');
const RateLimiter = require('./ratelimiter');

class PurePursuitController {
  constructor() {
    this.velocityProfiler = new RateLimiter(constants.DriveAccel, constants.DriveJerk);
    this.resetPath();
  }

  resetPath() {
    this.currentSegment = 0;
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
  }

  calculate(robotTransform) {
    const lookAheadDistance = util.map(this.velocity, this.minLookAheadDistanceSpeed, this.maxLookAheadDistanceSpeed,
      this.minLookAheadDistance, this.maxLookAheadDistance);
    const point = this.path.getPointByDistance(robotTransform.translation, this.currentSegment, lookAheadDistance);

    this.velocity = this.velocityProfiler.calculate(this.path.getSegmentData(this.currentSegment).speed, 1);


  }
}

module.exports = PurePursuitController;
