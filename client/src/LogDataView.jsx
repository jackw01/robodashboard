// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import ResizeAware from 'react-resize-aware';
import { Card, CardBody, CardTitle, Button, ButtonGroup, Input } from 'reactstrap';
import Ansi from './AnsiView';

import telemetryClient from './model/telemetryclient';
import storage from './model/storage';
import colors from './model/colors';
import styles from './model/styles';

class LocationDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.eventHandler = this.handleIncomingData.bind(this);

    telemetryClient.on('ready', () => {
      const keys = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'log';
      }).forEach((k) => {
        telemetryClient.on(`data-${k}`, this.eventHandler);
      });
    });
  }

  handleIncomingData(key, value) {
    this.setState((state) => {
      let newMessages = state.messages;
      newMessages.push(value);
      return { messages: newMessages };
    });
  }

  render() {
    return (
      <Card className='data-view log-data-view'>
        <CardBody>
          {this.state.messages.map((message) => { return <div><Ansi>{message}</Ansi><br/></div> })}
        </CardBody>
      </Card>
    );
  }
}

export default LocationDataView;
