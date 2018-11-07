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

  getSegmentData(index) {
    return this.segments[index].data;
  }

  // Get point on path that is the specified distance ahead from the specified point
  getPointByLookAheadDistance(startPoint, startSegment, distance) {
    // Get closest point to start point on path and translation between the two points
    let closestSegmentIndex = startSegment;
    let closestSegment = this.segments[startSegment];
    let closestPoint = closestSegment.getClosestPoint(startPoint);
    let closestToStart = closestPoint.inverse().translateBy(startPoint);

    // Iterate through segments in case the closest point is on another segment
    for (let i = startSegment + 1; i < this.segments.length; i++) {
      const closestNextSegment = this.segments[i];
      const closestNextPoint = closestNextSegment.getClosestPoint(startPoint);
      const closestNextToStart = closestNextPoint.inverse().translateBy(startPoint);
      if (closestNextToStart.getDistance() < closestToStart.getDistance()) {
        closestSegmentIndex = i;
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
      // If the look ahead point is beyond the current segment, iterate through segments to find it
      lookAheadDistance -= remainingSegmentDistance;
      let i = closestSegmentIndex + 1;
      while (lookAheadDistance > this.segments[i].deltaDistance && i < this.segments.length - 1) {
        lookAheadDistance -= this.segments[i].deltaDistance;
        i++;
      }
      // When we are on the last segment or look ahead point is within current segment, get point
      lookAheadPoint = this.segments[i].getPointByDistance(lookAheadDistance);
    } else {
      // If look ahead point is already in current segment, get point
      lookAheadPoint = closestSegment.getPointByDistanceFromEnd(remainingSegmentDistance - lookAheadDistance);
    }
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
