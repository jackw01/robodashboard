// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// Types:
// Numeric - numeric or object with numeric values for each key
//   subKeys is an array of possible keys in an object
//
// State - string
//
// Control - one-way button control

module.exports = Object.freeze({
  Numeric: 'numeric',
  State: 'state',
  Control: 'control',
});
