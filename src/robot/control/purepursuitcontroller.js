// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const util = require('../../util');
const constants = require('../constants');
const DriveState = require('./drivestate');
const RateLimiter = require('./ratelimiter');

class PurePursuitController {
  constructor() {
    this.speedProfiler = new RateLimiter(constants.DriveAccel, constants.DriveJerk);
    this.resetPath();
  }

  resetPath() {
    this.segment = 0;
    this.velocity = 0;
    this.speedProfiler.reset();
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
    // Are we done?
    if (lookAhead.remainingSegmentDistance === 0.0) return new DriveState(0, 0, true);

    // Calculate speed with motion profile - target speed is the one on the closest path segment
    this.speed = this.speedProfiler.calculate(lookAhead.closestSegmentData.speed, 1);

    // Transform from look ahead point to position
    const lookAheadTransform = positionTransform.translation
      .inverse()
      .translateBy(lookAhead.point)
      .rotateBy(positionTransform.rotation.inverse());

    // Calculate curvature of path
    // radius = distanceToLookAheadPoint^2 / 2x
    // curvature = 1 / radius
    // angularSpeed = trackRadius * curvature * speed
    // If trackRadius = pathRadius, trackRadius * curvature = 1 and only one motor will move making turn radius
    //   equal to the track radius
    // If pathRadius = trackRadius*2, trackRadius * curvature = 0.5 and wheel speeds will be (0.5*speed, 1.5*speed)
    // Inner track will be 1/3 the diameter of the outer track. Since we know the tracks are 2*trackRadius apart,
    // solving the system of equations shows that the inner/outer track radii will be trackRadius and 3*trackRadius
    // Finding the center of the tracks shows that 2*trackRadius is the turning radius
    const curvature = (2 * lookAheadTransform.x) / (lookAheadTransform.getDistance() ** 2);
    const angularSpeed = (constants.TrackDiameter / 2) * curvature * this.speed;

    // Keep speed under limit
    const highestSpeed = Math.abs(this.speed) + Math.abs(angularSpeed);
    let newSpeed = this.speed;
    if (highestSpeed > this.maxSpeed) newSpeed -= (highestSpeed - this.maxSpeed) * Math.sign(this.speed);
    return new DriveState(newSpeed - angularSpeed, newSpeed + angularSpeed, false);
  }
}

module.exports = PurePursuitController;
