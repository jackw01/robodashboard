// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import colors from './colors';

const styles = {
  axes: {
    line: { stroke: colors.gray600 },
    ticks: { stroke: colors.gray300 },
    text: { stroke: 'none', fill: colors.gray200, fontWeight: 400, fontSize: 9 }
  },
  gridLines: {
    stroke: colors.gray700,
  },
  robotPath: {
    stroke: colors.primary,
    fill: 'none',
  },
  robotPosition: {
    stroke: 'none',
    fill: colors.primary,
    opacity: 0.6,
  },
}

export default styles;
