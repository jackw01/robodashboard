// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryContainer from './TelemetryContainer';
import telemetryClient from './model/telemetryclient';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { keys: [] };
    telemetryClient.on('ready', () => {
      this.setState({
        keys: Object.keys(telemetryClient.dataPoints),
        dataPoints: telemetryClient.dataPoints,
      });
    })
  }
  render() {
    const rows = this.state.keys.map((key) => {
      const dp = this.state.dataPoints[key];
      return (
        <Row>
          <TelemetryContainer
            dataKey={key}
            description={dp.description}
            range={dp.range}
            historyLength={dp.historyLengthS}
            historyLengthMultiplier={1000 / dp.updateIntervalMs}
            subKeys={dp.subKeys}/>
        </Row>
      )
    });

    return (
      <div className='App'>
        <Container>
          {rows}
        </Container>
      </div>
    );
  }
}

export default App;
