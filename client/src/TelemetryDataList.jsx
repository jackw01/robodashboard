// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
import TelemetryContainer from './TelemetryContainer';
import telemetryClient from './model/telemetryclient';

class TelemetryDataList extends Component {
  constructor(props) {
    super(props);
    this.state = { graph: false, items: [] };
    telemetryClient.on('ready', () => {
      this.setState({
        items: Object.keys(telemetryClient.dataPoints),
        dataPoints: telemetryClient.dataPoints,
      });
    })
  }

  toggleGraphs() {
    this.setState({ items: this.state.items, graph: !this.state.graph });
  }

  render() {
    return (
      <Container className='telemetry-data-list'>
        <Row>
          <Col>
            <span className='telemetry-data-list-title'>Telemetry</span>
            <br/>
            <Button color="primary" onClick={this.toggleGraphs.bind(this)}
              active={this.state.graph}>Graph All</Button>
          </Col>
        </Row>
        <hr/>
        {this.state.items.map((k, i) => {
          const dp = this.state.dataPoints[k];
          const graph = this.state.graph;
          return (
            <Row>
              <Col>
                <TelemetryContainer
                  dataKey={k}
                  description={dp.description}
                  range={dp.range}
                  historyLength={dp.historyLengthS}
                  historyLengthMultiplier={1000 / dp.updateIntervalMs}
                  subKeys={dp.subKeys}
                  visible={graph}
                  key={graph}/>
              </Col>
            </Row>
          )
        })}
      </Container>
    );
  }
}

export default TelemetryDataList;
