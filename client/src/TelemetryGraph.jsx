// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, Hint, HorizontalGridLines, LineSeries } from 'react-vis';
import PropTypes from 'prop-types';
import telemetryClient from './model/telemetryclient';
import colors from './model/colors';

class TelemetryGraph extends Component {
  static propTypes = {
    dataKey: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    range: PropTypes.array,
    historyLength: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    const data = {};
    this.state = { data: data, ready: false, lastHistoryLength: 0 };
    telemetryClient.on('data', this.handleIncomingData.bind(this));
  }

  handleIncomingData(key, value) {
    if (key === this.props.dataKey) {
      this.setState((state) => {
        let ready = state.ready;
        if (state.lastHistoryLength !== this.props.historyLength) ready = false;
        const data = state.data;
        if (typeof value === 'object') {
          Object.entries(value).forEach(([key, value]) => {
            if (!ready) {
              data[key] = [];
              for (let x = 0; x < this.props.historyLength; x++) data[key].push({ x: x, y: 0 });
            }
            for (let x = 0; x < this.props.historyLength - 1; x++) data[key][x].y = data[key][x + 1].y;
            data[key][this.props.historyLength - 1].y = value;
          });
        } else {
          if (!ready) {
            data[this.props.dataKey] = [];
            for (let x = 0; x < this.props.historyLength; x++) data[this.props.dataKey].push({ x: x, y: 0 });
          }
          for (let x = 0; x < this.props.historyLength - 1; x++) {
            data[this.props.dataKey][x].y = data[this.props.dataKey][x + 1].y;
          }
          data[this.props.dataKey][this.props.historyLength - 1].y = value;
        }
        return { data: data, ready: true, lastHistoryLength: this.props.historyLength };
      });
    }
  }

  render() {
    return (
      <XYPlot height={this.props.height} width={this.props.width} animation={true} yDomain={this.props.range}>
        <HorizontalGridLines />
        {Object.keys(this.state.data).map((k, i) => (
          <LineSeries data={this.state.data[k]} color={colors.array[i]}/>
        ))}
        <XAxis />
        <YAxis />
      </XYPlot>
    );
  }
}

export default TelemetryGraph;
