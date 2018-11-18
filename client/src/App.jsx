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
    const rows = this.state.keys.map((key) => (
      <Row>
        <TelemetryContainer
          dataKey={key}
          description={this.state.dataPoints[key].description}
          historyLength='60' />
      </Row>
    ));

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
