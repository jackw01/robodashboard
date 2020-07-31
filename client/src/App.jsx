// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryDataView from './TelemetryDataView';
import LocationDataView from './LocationDataView';
import LogDataView from './LogDataView';
import InfoModal from './InfoModal';
import OptionsModal from './OptionsModal';
import ControlsView from './ControlsView';
import StatusView from './StatusView';
import SecondaryStatusView from './SecondaryStatusView';

class App extends Component {
  render() {
    return (
      <div className="main h-100">
        <Container className="app h-100 d-flex flex-column" fluid>
          <Row className="outer h-100">
            <Col xs="4" className="h-100">
              <TelemetryDataView />
            </Col>
            <Col xs="8" className="h-100">
              <Row>
                <Col xs="9" className="h-100">
                  mjpeg here
                </Col>
                <Col xs="3" className="h-100">
                  <SecondaryStatusView />
                </Col>
              </Row>
              <LogDataView />
            </Col>
          </Row>
        </Container>
        <div className="status-container">
          <InfoModal />
          <OptionsModal />
          <ControlsView />
          <StatusView />
        </div>
      </div>
    );
  }
}

export default App;
