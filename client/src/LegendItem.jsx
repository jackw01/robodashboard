// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';

class LegendItem extends Component {
  render() {
    return (
      <span>
        &nbsp;
        <svg height={2} width={14}>
          <path
            d="M 0, 1 L 14, 1"
            style={{ stroke: this.props.color, strokeWidth: 2 }}
          />
        </svg>&nbsp;
        <span>{this.props.title}</span>&nbsp;
      </span>
    );
  }
}

export default LegendItem;
