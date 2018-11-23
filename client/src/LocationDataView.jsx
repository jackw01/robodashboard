// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
import storage from './model/storage';
import telemetryClient from './model/telemetryclient';

class LocationDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    telemetryClient.on('ready', () => {

    });
  }

  render() {
    return (
      <Container className='telemetry-data-view'>
        <Row className='data-view-header'>
          <Col>
            <span className='data-view-title'>Location</span>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LocationDataView;
