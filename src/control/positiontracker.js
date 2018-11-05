const transform = require('./transform.js');

class PositionTracker {
  constructor() {
    this.resetOdometry();
  }

  // Transform the current transformation based on new left/right distance and deltaAngle
  // Translate the transformation by the wheel surface distance traveled rotated by deltaAngle / 2
  // Rotate the transformation by deltaAngle
  // Assuming that angle changes continuously over the course of the robot's movement, deltaAngle is divided by 2
  // to get the average angle during this tick and predict how the heading changes affect the direction of movement
  calculate(leftDistance, rightDistance, deltaAngle) {
    const currentDistance = (leftDistance + rightDistance) / 2.0;
    const deltaP = new transform.Translation2D(currentDistance - this.oldDistance, 0);
    const deltaR = transform.Rotation2DFromRadians(-deltaAngle);
    const halfR = transform.Rotation2DFromRadians(deltaR.getRadians() / 2.0);
    this.transform = this.transform.transform(new transform.RigidTransform(deltaP.rotateBy(halfR), deltaR));
    this.oldDistance = currentDistance;
    this.oldLeftDistance = leftDistance;
    this.oldRightDistance = rightDistance;
  }

  getCurrentOdometry() {
    return this.transform;
  }

  resetOdometry() {
    this.transform = new transform.RigidTransform(new transform.Translation2D(0, 0), new transform.Rotation2D(1, 0));
    this.oldDistance = 0;
    this.oldLeftDistance = 0;
    this.oldRightDistance = 0;
  }
}

module.exports = PositionTracker;
