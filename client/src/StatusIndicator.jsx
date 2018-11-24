// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import telemetryClient from './model/telemetryclient';

class StatusIndicator extends Component {
  static propTypes = {

  }

  render() {
    return (
      <Badge color="primary" pill>Primary</Badge>
    );
  }
}

export default StatusIndicator;
