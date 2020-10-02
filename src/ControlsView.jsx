// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

import telemetryClient from './model/telemetryclient';

class ControlsView extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.state = {
      controls: {},
    };
  }

  componentDidMount() {
    telemetryClient.on('ready', () => {
      const controls = {};
      Object.keys(telemetryClient.dashboardItems)
        .filter((k) => {
          return (
            telemetryClient.dashboardItems[k].type === 'buttonControl'
          );
        })
        .forEach((k) => {
          controls[k] = telemetryClient.dashboardItems[k];
        });
      this.setState({ controls: controls });
    });
  }

  onClick(key, event) {
    telemetryClient.handleControlClick(key);
  }

  render() {
    return (
      <span className='controls-view'>
        {Object.entries(this.state.controls).map(([k, v]) => {
          return (
            <ButtonGroup key={k}>
              {Object.entries(v.controls).map(([k, v]) => {
                return (
                  <Button
                    color={v.color}
                    size='sm'
                    onClick={this.onClick.bind(this, k)}
                    key={k}
                  >
                    {v.label}
                  </Button>
                );
              })}
            </ButtonGroup>
          );
        })}
      </span>
    );
  }
}

export default ControlsView;
