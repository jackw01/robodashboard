// 2-dimensional rotation transformation represented by cos and sin of angle
class Rotation2D {
  constructor(cos, sin) {
    this.cos = cos;
    this.sin = sin;
  }

  getRadians() {
    return Math.atan2(this.sin, this.cos);
  }

  normalize() {
    const magnitude = Math.hypot(this.cos, this.sin);
    if (magnitude > 1E-9) {
      this.cos /= magnitude;
      this.sin /= magnitude;
    } else {
      this.cos = 1.0;
      this.sin = 0.0;
    }
  }

  // Inverse around zero rotation
  inverse() {
    return new Rotation2D(this.cos, -this.sin);
  }

  // Flip around x and y axis
  flip() {
    return new Rotation2D(-this.cos, -this.sin);
  }

  rotateBy(delta) {
    const ret = new Rotation2D(this.cos * delta.cos - this.sin * delta.sin,
      this.sin * delta.cos + this.cos * delta.sin);
    ret.normalize();
    return ret;
  }
}

function Rotation2DFromRadians(angle) {
  return new Rotation2D(Math.cos(angle), Math.sin(angle));
}

// 2-dimensional translation with x and y
class Translation2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance() {
    return Math.hypot(this.x, this.y);
  }

  getDistanceTo(other) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  inverse() {
    return new Translation2D(-this.x, -this.y);
  }

  getAngle(other) {
    return Rotation2DFromRadians(Math.atan2(other.y - this.y, other.x - this.x));
  }

  getAngleFromYAxis(other) {
    return Rotation2DFromRadians(Math.asin((this.x - other.x) / this.getDistanceTo(other)));
  }

  getAngleFromOffset(other) {
    return other.getAngle(this);
  }

  getAngleFromOffsetFromYAxis(other) {
    return other.getAngleFromYAxis(this);
  }

  translateBy(delta) {
    return new Translation2D(this.x + delta.x, this.y + delta.y);
  }

  rotateBy(rotation) {
    return new Translation2D(this.x * rotation.cos - this.y * rotation.sin,
      this.x * rotation.sin + this.y * rotation.cos);
  }
}

function Translation2DFromPolar(distance, rotation) {
  return new Translation2D(rotation.sin * distance, rotation.cos * distance);
}

class RigidTransform2D {
  constructor(translation, rotation) {
    this.translation = translation;
    this.rotation = rotation;
  }

  transform(delta) {
    return new RigidTransform2D(this.translation.translateBy(delta.translation.rotateBy(this.rotation)),
      this.rotation.rotateBy(delta.rotation));
  }
}


module.exports = {
  Rotation2D,
  Rotation2DFromRadians,
  Translation2D,
  Translation2DFromPolar,
  RigidTransform2D,s
};
