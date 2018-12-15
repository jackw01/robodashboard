// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryDataView from './TelemetryDataView';
import LocationDataView from './LocationDataView';
import LogDataView from './LogDataView';
import StatusIndicatorView from './StatusIndicatorView';
import ControlsView from './ControlsView';

class App extends Component {
  render() {
    return (
      <div className='main h-100'>
        <Container className='app h-100 d-flex flex-column' fluid>
          <Row className='h-100'>
            <Col xs='5' className='h-100'>
              <TelemetryDataView/>
            </Col>
            <Col xs='7' className='h-100'>
              <LocationDataView/>
              <LogDataView/>

            </Col>
          </Row>
        </Container>
        <div className='status-container'>
          <ControlsView/>
          <StatusIndicatorView/>
        </div>
      </div>
    );
  }
}

export default App;
