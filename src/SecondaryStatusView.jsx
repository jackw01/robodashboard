// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import MultiBadge from './MultiBadge';

import telemetryClient from './model/telemetryclient';

class SecondaryStatusView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyStates: {},
    }

    this.eventHandler = this.handleIncomingData.bind(this);
  }

  componentDidMount() {
    telemetryClient.on("ready", () => {
      const keyStates = {};
      Object.keys(telemetryClient.dashboardItems)
        .filter((k) => {
          return (
            telemetryClient.dashboardItems[k].type === "state" &&
            telemetryClient.dashboardItems[k].isSecondaryState
          );
        })
        .forEach((k) => {
          telemetryClient.on(`data-${k}`, this.eventHandler);
          keyStates[k] = telemetryClient.dashboardItems[k].defaultState;
        });
      this.setState({ keyStates: keyStates });
    });
  }

  handleIncomingData(key, value) {
    this.setState((state) => {
      const keyStates = state.keyStates;
      keyStates[key] = value;
      return { keyStates: keyStates };
    });
  }

  render() {
    return (
      <Card className='data-view secondary-status-view'>
        <CardBody>
          {Object.entries(this.state.keyStates).map(([k, v]) => {
            const dashboardItem = telemetryClient.dashboardItems[k];
            return (
              <div>
                <MultiBadge
                  label={dashboardItem.description}
                  segments={[
                    { color: dashboardItem.states[v].controlColor, contents: dashboardItem.states[v].label },
                  ]}
                  key={k} />
                <br/>
              </div>
            );
          })}
        </CardBody>
      </Card>
    );
  }
}

export default SecondaryStatusView;
