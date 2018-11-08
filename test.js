import test from 'ava';

const path = require('./src/control/path');

function round(num, prec) {
  const precision = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10][prec];
  return Math.round(num * precision + 1e-14) / precision;
}

test('PathSegment.getPercentageOnSegment', (t) => {
  const seg = path.PathSegmentFromCoords(0, 0, 4, 4);
  t.is(round(seg.getPercentageOnSegment({ x: 1, y: 1 }), 3), 0.25);
  t.is(round(seg.getPercentageOnSegment({ x: 2, y: 2 }), 3), 0.5);
  t.is(round(seg.getPercentageOnSegment({ x: 4, y: 4 }), 3), 1.0);
  t.is(round(seg.getPercentageOnSegment({ x: 1, y: 3 }), 3), 0.5);
  t.is(round(seg.getPercentageOnSegment({ x: 3, y: 1 }), 3), 0.5);
  t.is(round(seg.getPercentageOnSegment({ x: 1, y: 4 }), 3), 0.625);
  t.is(round(seg.getPercentageOnSegment({ x: 4, y: 1 }), 3), 0.625);
});
