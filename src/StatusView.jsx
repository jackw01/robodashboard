// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import MultiBadge from './MultiBadge';

import telemetryClient from './model/telemetryclient';

class StatusView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Disconnected',
      readyStatus: 'Not Ready',
      statusColor: 'danger',
      readyStatusColor: 'danger',
      keyStates: {},
    }

    this.eventHandler = this.handleIncomingData.bind(this);
  }

  componentDidMount() {
    telemetryClient.on("connect", () => {
      this.setState({ status: "Connected", statusColor: "success" });
    });

    telemetryClient.on("disconnect", () => {
      this.setState({
        status: "Disconnected",
        statusColor: "danger",
        readyStatus: "Not Ready",
        readyStatusColor: "danger",
      });
    });

    telemetryClient.on("ready", () => {
      const keyStates = {};
      Object.keys(telemetryClient.dashboardItems)
        .filter((k) => {
          return (
            telemetryClient.dashboardItems[k].type === "state" &&
            !telemetryClient.dashboardItems[k].isSecondaryState
          );
        })
        .forEach((k) => {
          telemetryClient.on(`data-${k}`, this.eventHandler);
          keyStates[k] = telemetryClient.dashboardItems[k].defaultState;
        });
      this.setState({
        readyStatus: "Ready",
        readyStatusColor: "success",
        keyStates: keyStates,
      });
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
      <span className='status-indicator-view'>
        <MultiBadge label='Status' segments={[
            { color: this.state.statusColor, contents: this.state.status },
            { color: this.state.readyStatusColor, contents: this.state.readyStatus },
          ]}/>
        {Object.entries(this.state.keyStates).map(([k, v]) => {
          const dashboardItem = telemetryClient.dashboardItems[k];
          return (<MultiBadge label={dashboardItem.description} segments={[
              { color: dashboardItem.states[v].controlColor, contents: dashboardItem.states[v].label },
            ]} key={k}/>);
        })}
      </span>
    );
  }
}

export default StatusView;
