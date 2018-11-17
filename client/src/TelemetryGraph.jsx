import React, { Component } from 'react';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import telemetryClient from './model/telemetryclient';

class TelemetryGraph extends Component {
  constructor() {
    super();
    this.data = [];
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
