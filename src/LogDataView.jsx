// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2020 jackw01. Released under the MIT License (see LICENSE for details).

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

    this.endRef = React.createRef();
    this.eventHandler = this.handleIncomingData.bind(this);
  }

  componentDidMount() {
    telemetryClient.on('ready', () => {
      Object.keys(telemetryClient.dashboardItems)
      .filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'log';
      })
      .forEach((k) => {
        telemetryClient.on(`data-${k}`, this.eventHandler);
      });
    });
  }

  handleIncomingData(key, value, timestamp) {
    this.setState({
      messages: [...this.state.messages, { timestamp: new Date(timestamp), value }],
    },
    () => {
        this.endRef.current.scrollIntoView({ behavior: 'smooth' })
    });
  }

  render() {
    return (
      <Card className='data-view log-data-view'>
        <CardBody>
          {this.state.messages.map((m) => {
            return (
              <div key={m.timestamp}>
                <Ansi>
                  {`${dateFormat(m.timestamp, 'UTC:"T"HH:MM:ss.l"Z"')} ${m.value}`}
                </Ansi>
                <br/>
              </div>
            );
          })}
          <div ref={this.endRef} />
        </CardBody>
      </Card>
    );
  }
}

export default LogDataView;
