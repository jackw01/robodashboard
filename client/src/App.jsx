import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import telemetryClient from './model/telemetryclient';
import TelemetryGraph from './TelemetryGraph';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <TelemetryGraph telemetryKey='batteryVoltage' historyLength='60' />
            <Col>Test Column</Col>
            <Col>Test Column</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
