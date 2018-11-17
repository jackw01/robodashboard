import React, { Component } from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import telemetryClient from './model/telemetryclient';

class TelemetryGraph extends Component {
  constructor(props) {
    super(props);
    this.data = [];
    for (let x = 0; x < this.props.historyLength; x++) this.data.push({ x: x, y: 0 })
    telemetryClient.on('data', this.handleIncomingData.bind(this));
  }

  handleIncomingData(key, value) {
    if (key === this.props.telemetryKey) {
      this.data.shift();
      this.data.push({ x: this.props.historyLength - 1, y: value });
    }
  }

  render() {
    return (
      <XYPlot height={200} width={200}>
        <HorizontalGridLines />
        <LineSeries data={this.data} />
        <XAxis />
        <YAxis />
      </XYPlot>
    );
  }
}

export default TelemetryGraph;
