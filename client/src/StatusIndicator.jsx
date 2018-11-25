// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MultiBadge from './MultiBadge';
import telemetryClient from './model/telemetryclient';

class StatusIndicator extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      status: 'Disconnected',
      readyStatus: 'Not Ready',
      statusColor: 'danger',
      readyStatusColor: 'danger',
    }

    telemetryClient.on('connect', () => {
      this.setState({ status: 'Connected', statusColor: 'success' });
    });

    telemetryClient.on('disconnect', () => {
      this.setState({
        status: 'Disconnected', statusColor: 'danger',
        readyStatus: 'Not Ready', readyStatusColor: 'danger'  
      });
    });

    telemetryClient.on('ready', () => {
      this.setState({ readyStatus: 'Ready', readyStatusColor: 'success' });
    });
  }

  render() {
    return (
      <MultiBadge label='Status:' segments={[
          { color: this.state.statusColor, contents: this.state.status },
          { color: this.state.readyStatusColor, contents: this.state.readyStatus },
        ]}/>
    );
  }
}

export default StatusIndicator;
