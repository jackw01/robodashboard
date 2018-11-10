// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

function map(x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function clampAndMap(x, inMin, inMax, outMin, outMax) {
  return clamp(map(x, inMin, inMax, outMin, outMax), outMin, outMax);
}

module.exports = {
  map,
  clamp,
  clampAndMap,
};
