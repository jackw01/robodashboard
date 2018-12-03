// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import colors from './model/colors';
import styles from './model/styles';

class HeadingIndicator extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
  }

  render() {
    const cx = this.props.width / 2;
    const cy = this.props.height / 2;
    const x = cx + Math.cos(this.props.heading) * (this.props.radius - 2);
    const y = cy + Math.sin(this.props.heading) * (this.props.radius - 2);
    return (
      <svg height={this.props.height} width={this.props.width} className='heading-indicator'>
        <circle cx={cx} cy={cy} r={this.props.radius} stroke={colors.gray400} fill='none'/>
          <path
            d={`M ${cx}, ${cy} L ${x}, ${y}`}
            style={{ stroke:colors.primary, strokeWidth: 2 }}/>
      </svg>
    );
  }
}

export default HeadingIndicator;
