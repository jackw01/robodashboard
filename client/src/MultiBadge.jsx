// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';

class MultiBadge extends Component {
  static propTypes = {
    label: PropTypes.string,
    segments: PropTypes.arrayOf(PropTypes.shape({
      color: PropTypes.string,
      contents: PropTypes.string,
    })),
  }

  render() {
    return (
      <span className='multi-badge'>
        <span className='badge badge-pill'>{this.props.label}</span>
        {this.props.segments.map((seg, i) => <Badge color={seg.color} pill key={i}>{seg.contents}</Badge>)}
      </span>
    );
  }
}

export default MultiBadge;
