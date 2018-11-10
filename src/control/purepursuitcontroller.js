// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const util = require('../util');
const constants = require('./constants');
const RateLimiter = require('./ratelimiter');

class PurePursuitController {
  constructor() {
    this.speedProfiler = new RateLimiter(constants.DriveAccel, constants.DriveJerk);
    this.resetPath();
  }

  resetPath() {
    this.segment = 0;
    this.velocity = 0;
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

  calculate(positionTransform) {
    // Get dynamic look ahead distance based on last iteration's speed
    const lookAheadDistance = util.clampAndMap(this.speed, this.minLookAheadDistanceSpeed,
      this.maxLookAheadDistanceSpeed, this.minLookAheadDistance, this.maxLookAheadDistance);
    // Get look ahead point and data on closest segment to current point
    const lookAhead = this.path.getPointByDistance(positionTransform.translation, this.segment, lookAheadDistance);
    this.segment = lookAhead.closestSegmentIndex;

    // Calculate speed with motion profile - target speed is the one on the closest path segment
    this.speed = this.speedProfiler.calculate(lookAhead.closestSegmentData.speed, 1);

    // Transform from look ahead point to position
    const lookAheadTransform = positionTransform.translation
      .inverse()
      .translateBy(lookAhead.point)
      .rotateBy(positionTransform.rotation.inverse());
  }
}

module.exports = PurePursuitController;
