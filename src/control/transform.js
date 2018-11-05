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

  rotateBy(rotation) {
    const ret = new Rotation2D(this.cos * rotation.cos - this.sin * rotation.sin,
      this.sin * rotation.cos + this.cos * rotation.sin);
    ret.normalize();
    return ret;
  }
}

function Rotation2DFromRadians(angle) {
  return new Rotation2D(Math.cos(angle), Math.sin(angle));
}

module.exports = {
  Rotation2D,
  Rotation2DFromRadians,
};
