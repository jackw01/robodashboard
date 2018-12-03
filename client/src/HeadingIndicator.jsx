// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import colors from './model/colors';
import styles from './model/styles';

class HeadingIndicator extends Component {
  static propTypes = {
    heading: PropTypes.number.isRequired,
  }

  render() {
    return (
      <svg height={40} width={40} className='heading-indicator'>
        <circle cx={20} cy={20} r={16} stroke={colors.gray400} fill='none'/>
          <path d='M 0, 1 L 14, 1' style={{ stroke: this.props.color, strokeWidth: 2 }}/>
      </svg>
    );
  }
}

export default HeadingIndicator;
