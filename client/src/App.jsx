import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryContainer from './TelemetryContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Row><TelemetryContainer telemetryKey='batteryVoltage' historyLength='60' /></Row>
          <Row><TelemetryContainer telemetryKey='batteryVoltage' historyLength='60' /></Row>
        </Container>
      </div>
    );
  }
}

export default App;
