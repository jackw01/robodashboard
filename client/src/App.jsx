// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryDataView from './TelemetryDataView';
import LocationDataView from './LocationDataView';
import StatusIndicatorView from './StatusIndicatorView';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className='info-floater'>
          <StatusIndicatorView/>
        </div>
        <Container className='app'>
          <Row>
            <Col><TelemetryDataView/></Col>
            <Col><LocationDataView/></Col>
          </Row>
        </Container>

      </div>
    );
  }
}

export default App;
