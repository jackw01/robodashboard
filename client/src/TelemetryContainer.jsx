// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryGraph from './TelemetryGraph';
import LegendItem from './LegendItem';

class TelemetryContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='telemetry-container'>
        <span className='telemetry-container-description'>{this.props.description}</span>
        <LegendItem color={'#fd9d15'} title={'x'}/>
        <LegendItem color={'#fd9d15'} title={'y'}/><br/>
        <TelemetryGraph
          height={100} width={300}
          dataKey={this.props.dataKey} historyLength={this.props.historyLength}
          range={this.props.range}
        />
      </div>
    );
  }
}

export default TelemetryContainer;
