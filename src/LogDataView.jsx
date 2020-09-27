// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import dateFormat from 'dateformat';
import { Card, CardBody, Button, ButtonGroup, Input } from 'reactstrap';
import Ansi from './AnsiView';

import telemetryClient from './model/telemetryclient';
import storage from './model/storage';

class LogDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.eventHandler = this.handleIncomingData.bind(this);

    telemetryClient.on('ready', () => {
      Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'log';
      }).forEach((k) => {
        telemetryClient.on(`data-${k}`, this.eventHandler);
      });
    });
  }

  handleIncomingData(key, value, timestamp) {
    this.setState((state) => {
      let newMessages = state.messages;
      newMessages.push({ timestamp: new Date(timestamp), value });
      return { messages: newMessages };
    });
  }

  render() {
    return (
      <Card className='data-view log-data-view'>
        <CardBody>
          {this.state.messages.map((m) => {
            return <div><Ansi>{`${dateFormat(m.timestamp, 'UTC:"T"HH:MM:ss.l"Z"')} ${m.value}`}</Ansi><br/></div>
          })}
        </CardBody>
      </Card>
    );
  }
}

export default LogDataView;