// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, Hint, HorizontalGridLines, LineSeries } from 'react-vis';
import telemetryClient from './model/telemetryclient';
import colors from './model/colors';

class TelemetryGraph extends Component {
  constructor(props) {
    super(props);
    const data = {};
    this.state = { data: data, ready: false };
    telemetryClient.on('data', this.handleIncomingData.bind(this));
  }

  handleIncomingData(key, value) {
    if (key === this.props.dataKey) {
      this.setState((state) => {
        const data = state.data;
        if (typeof value === 'object') {
          Object.entries(value).forEach(([key, value]) => {
            if (!state.ready) {
              data[key] = [];
              for (let x = 0; x < this.props.historyLength; x++) data[key].push({ x: x, y: 0 });
            }
            for (let x = 0; x < this.props.historyLength - 1; x++) data[key][x].y = data[key][x + 1].y;
            data[key][this.props.historyLength - 1].y = value;
          });
        } else {
          if (!state.ready) {
            data[this.props.dataKey] = [];
            for (let x = 0; x < this.props.historyLength; x++) data[this.props.dataKey].push({ x: x, y: 0 });
          }
          for (let x = 0; x < this.props.historyLength - 1; x++) {
            data[this.props.dataKey][x].y = data[this.props.dataKey][x + 1].y;
          }
          data[this.props.dataKey][this.props.historyLength - 1].y = value;
        }
        return { data: data, ready: true };
      });
    }
  }

  render() {
    const series = [];
    Object.keys(this.state.data).map((k, i) => {
      series.push(<LineSeries data={this.state.data[k]} color={colors.array[i]}/>);
    });
    return (
      <XYPlot height={this.props.height} width={this.props.width} animation={true} yDomain={this.props.range}>
        <HorizontalGridLines />
        {series}
        <XAxis />
        <YAxis />
      </XYPlot>
    );
  }
}

export default TelemetryGraph;
