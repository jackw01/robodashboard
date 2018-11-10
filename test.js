import test from 'ava';

const transform = require('./src/control/transform');
const path = require('./src/control/path');
const RateLimiter = require('./src/control/ratelimiter');

function round(num, prec) {
  const precision = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10][prec];
  return Math.round(num * precision + 1e-14) / precision;
}

function roundPt(pt, prec) {
  return { x: round(pt.x, prec), y: round(pt.y, prec) };
}

const testSeg = path.PathSegmentFromCoords(0, 0, 4, 4);

const testPath = path.PathFromPoints(new transform.Translation2D(0, 0), [
  new transform.Translation2D(10, 0),
  new transform.Translation2D(10, 5),
  new transform.Translation2D(0, 5),
  new transform.Translation2D(0, 10),
  new transform.Translation2D(10, 10),
], [0, 0, 0, 0, 0, 0]);

test('PathtestSegment.getPercentageOntestSegment', (t) => {
  t.is(round(testSeg.getPercentageOnSegment({ x: 1, y: 1 }), 3), 0.25);
  t.is(round(testSeg.getPercentageOnSegment({ x: 2, y: 2 }), 3), 0.5);
  t.is(round(testSeg.getPercentageOnSegment({ x: 4, y: 4 }), 3), 1.0);
  t.is(round(testSeg.getPercentageOnSegment({ x: 1, y: 3 }), 3), 0.5);
  t.is(round(testSeg.getPercentageOnSegment({ x: 3, y: 1 }), 3), 0.5);
  t.is(round(testSeg.getPercentageOnSegment({ x: 1, y: 4 }), 3), 0.625);
  t.is(round(testSeg.getPercentageOnSegment({ x: 4, y: 1 }), 3), 0.625);
});

test('PathtestSegment.getClosestPoint', (t) => {
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 1, y: 1 }), 3), { x: 1, y: 1 });
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 2, y: 2 }), 3), { x: 2, y: 2 });
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 4, y: 4 }), 3), { x: 4, y: 4 });
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 1, y: 3 }), 3), { x: 2, y: 2 });
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 3, y: 1 }), 3), { x: 2, y: 2 });
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 1, y: 4 }), 3), { x: 2.5, y: 2.5 });
  t.deepEqual(roundPt(testSeg.getClosestPoint({ x: 4, y: 1 }), 3), { x: 2.5, y: 2.5 });
});

test('PathtestSegment.getPointByDistance', (t) => {
  t.deepEqual(roundPt(testSeg.getPointByDistance(0), 3), { x: 0, y: 0 });
  t.deepEqual(roundPt(testSeg.getPointByDistance(Math.sqrt(2)), 3), { x: 1, y: 1 });
  t.deepEqual(roundPt(testSeg.getPointByDistance(Math.sqrt(32)), 3), { x: 4, y: 4 });
});

test('PathtestSegment.getPointByDistanceFromEnd', (t) => {
  t.deepEqual(roundPt(testSeg.getPointByDistanceFromEnd(0), 3), { x: 4, y: 4 });
  t.deepEqual(roundPt(testSeg.getPointByDistanceFromEnd(Math.sqrt(2)), 3), { x: 3, y: 3 });
  t.deepEqual(roundPt(testSeg.getPointByDistanceFromEnd(Math.sqrt(32)), 3), { x: 0, y: 0 });
});

test('Path.getPointByLookAheadDistance from start', (t) => {
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 0, 0), 3), { x: 0, y: 0 });
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 0, 12), 3), { x: 10, y: 2 });
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 0, 24), 3), { x: 1, y: 5 });
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 0, 40), 3), { x: 10, y: 10 });
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 0, 45), 3), { x: 15, y: 10 });
});

test('Path.getPointByLookAheadDistance from another segment', (t) => {
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 1, 0), 3), { x: 0, y: 5 });
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 0, y: 0 }, 1, 7), 3), { x: 2, y: 10 });
});

test('Path.getPointByLookAheadDistance from point off path', (t) => {
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 9, y: 6 }, 2, 3), 3), { x: 6, y: 5 });
  t.deepEqual(roundPt(testPath.getPointByDistance({ x: 5, y: 7.5 }, 3, 0), 4), { x: 5, y: 10 });
});

test('RateLimiter.calculate with accel', (t) => {
  const limiter = new RateLimiter(1, Number.MAX_VALUE);
  t.is(limiter.calculate(0, 1), 0);
  t.is(limiter.calculate(10, 1), 1);
  t.is(limiter.calculate(10, 2), 3);
  t.is(limiter.calculate(10, 7), 10);
  t.is(limiter.calculate(10, 10), 10);
  t.is(limiter.calculate(0, 1), 9);
  t.is(limiter.calculate(0, 2), 7);
  t.is(limiter.calculate(0, 7), 0);
  t.is(limiter.calculate(0, 10), 0);
});

test('RateLimiter.calculate with accel and jerk', (t) => {
  const limiter = new RateLimiter(4, 1);
  t.is(limiter.calculate(10, 1), 1);
  t.is(limiter.calculate(10, 1), 3);
  t.is(limiter.calculate(10, 1), 6);
  t.is(limiter.calculate(10, 1), 8);
  t.is(limiter.calculate(10, 1), 9);
  t.is(limiter.calculate(10, 1), 10);
  t.is(limiter.calculate(10, 1), 10);
  t.is(limiter.calculate(40, 1), 11);
  t.is(limiter.calculate(40, 1), 13);
  t.is(limiter.calculate(40, 1), 16);
  t.is(limiter.calculate(40, 1), 20);
  t.is(limiter.calculate(40, 1), 24);
  t.is(limiter.calculate(40, 1), 28);
  t.is(limiter.calculate(40, 1), 31);
  t.is(limiter.calculate(40, 1), 35);
  t.is(limiter.calculate(40, 1), 38);
  t.is(limiter.calculate(40, 1), 40);
  t.is(limiter.calculate(40, 1), 40);
  t.is(limiter.calculate(0, 1), 39);
  t.is(limiter.calculate(0, 1), 37);
  t.is(limiter.calculate(0, 1), 34);
});

test('RateLimiter.calculate with accel and infinite jerk', (t) => {
  const limiter = new RateLimiter(4, Number.MAX_VALUE);
  t.is(limiter.calculate(10, 1), 4);
  t.is(limiter.calculate(10, 1), 8);
  t.is(limiter.calculate(10, 1), 10);
  t.is(limiter.calculate(10, 1), 10);
  t.is(limiter.calculate(40, 1), 14);
  t.is(limiter.calculate(40, 1), 18);
  t.is(limiter.calculate(40, 1), 22);
  t.is(limiter.calculate(40, 1), 26);
  t.is(limiter.calculate(40, 1), 30);
  t.is(limiter.calculate(40, 1), 34);
  t.is(limiter.calculate(40, 1), 38);
  t.is(limiter.calculate(40, 1), 40);
  t.is(limiter.calculate(40, 1), 40);
});
