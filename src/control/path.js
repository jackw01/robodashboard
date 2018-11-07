// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const transform = require('./transform');
const util = require('../util');

// Path segment represented by two points
class PathSegment {
  constructor(start, end, data) {
    this.start = start;
    this.end = end;
    this.data = data;
    this.delta = start.inverse().translateBy(end);
    this.deltaDistance = this.delta.getDistance();
  }

  getPercentageOnSegment(point) {
    const u = ((point.x - this.start.x) * this.delta.x
               + (point.y - this.start.y) * this.delta.y)
              / (this.deltaDistance ** 2);
    return util.clamp(u, 0, 1);
  }

  getClosestPoint(point) {
    const u = this.getPercentageOnSegment(point);
    return new transform.Translation2D(this.start.x + this.delta.x * u, this.start.y + this.delta.y * u);
  }

  getPointByDistance(distance) {
    const u = distance / this.deltaDistance;
    return new transform.Translation2D(this.start.x + this.delta.x * u, this.start.y + this.delta.y * u);
  }

  getPointByDistanceFromEnd(distance) {
    const u = distance / this.deltaDistance;
    return new transform.Translation2D(this.end.x - this.delta.x * u, this.end.y - this.delta.y * u);
  }
}

function PathSegmentFromCoords(startX, startY, endX, endY) {
  return new module.exports.PathSegment(new transform.Translation2D(startX, startY),
    new transform.Translation2D(endX, endY));
}

// Path represented by a series of segments with associated data objects
class Path {
  constructor(start) {
    this.segments = [];
    this.lastPoint = start;
    this.empty = true;
  }

  addPoint(point, data) {
    this.segments.push(new PathSegment(this.lastPoint, point, data));
    this.lastPoint = point;
    this.empty = false;
  }

  addPointFromCoords(x, y, data) {
    this.addPoint(new transform.Translation2D(x, y), data);
  }

  addPoints(points, dataArray) {
    for (let i = 0; i < points.length; i++) this.addPoint(points[i], dataArray[i]);
  }

  getCurrentSegmentData() {
    return this.segments[0].data;
  }

  // Get point on path that is the specified distance ahead from the specified point
  getPointByLookAheadDistance(startPoint, distance) {
    // Get closest point to start point on path and translation between the two points
    let closestSegment = this.segments[0];
    let closestPoint = closestSegment.getClosestPoint(startPoint);
    let closestToStart = closestPoint.inverse().translateBy(startPoint);

    // Iterate through segments in case the closest point is on another segment
    for (let i = 1; i < this.segments.length; i++) {
      const closestNextSegment = this.segments[i];
      const closestNextPoint = closestNextSegment.getClosestPoint(startPoint);
      const closestNextToStart = closestNextPoint.inverse().translateBy(startPoint);
      if (closestNextToStart.getDistance() < closestToStart.getDistance()) {
        closestSegment = closestNextSegment;
        closestPoint = closestNextPoint;
        closestToStart = closestNextToStart;
      } else break;
    }

    const segmentEnd = closestSegment.end;
    const closestToEnd = closestPoint.inverse().translateBy(segmentEnd);
    const remainingSegmentDistance = closestToEnd.getDistance();

    // Perform actual look ahead calculation
    let lookAheadDistance = distance + closestToStart.getDistance();
    let lookAheadPoint;

    if (lookAheadDistance > remainingSegmentDistance) {

    } else {
      lookAheadPoint = closestSegment.getPointByDistanceFromEnd(remainingSegmentDistance - lookAheadDistance);
    }

    /*
    let lookAheadDistance = distance + closestToStart.getDistance();
    let lookAheadPoint;

    if (lookAheadDistance > remainingSegmentDistance && this.segments.length > 1) {
      lookAheadDistance -= remainingSegmentDistance;
      for (let i = 1; i < this.segments.length; i++) {
        if (lookAheadDistance > this.segments[i].deltaDistance && i !== this.segments.length - 1) {
          lookAheadDistance -= this.segments[i].deltaDistance;
        } else {
          lookAheadPoint = this.segments[i].getPointByDistance(lookAheadDistance);
          break;
        }
      }
    } else {
      const finalSegmentDistance = this.segments[0].deltaDistance - remainingSegmentDistance + lookAheadDistance;
      if (this.segments.length === 1 && finalSegmentDistance > this.segments[0].deltaDistance) {
        lookAheadPoint = this.segments[0].end;
      } else {
        lookAheadPoint = this.segments[0].getPointByDistance(finalSegmentDistance);
      }
    }
    */

    return lookAheadPoint;
  }
}

function PathFromPoints(start, points, dataArray) {
  const p = new module.exports.Path(start);
  p.addPoints(points, dataArray);
  return p;
}

module.exports = {
  PathSegment,
  PathSegmentFromCoords,
  Path,
  PathFromPoints,
};
