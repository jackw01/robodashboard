import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import telemetryClient from './model/telemetryclient';

class TelemetryGraph extends Component {
  constructor(props) {
    super(props);
    const data = [];
    for (let x = 0; x < this.props.historyLength; x++) data.push({ x: x, y: 0 });
    this.state = { data: data };
    telemetryClient.on('data', this.handleIncomingData.bind(this));
  }

  handleIncomingData(key, value) {
    if (key === this.props.telemetryKey) {
      this.setState((state) => {
        const data = state.data;
        for (let x = 0; x < this.props.historyLength - 1; x++) data[x].y = data[x + 1].y;
        data[this.props.historyLength - 1].y = value;
        return { data: data };
      });
    }
  }

  render() {
    return (
      <XYPlot height={this.props.height} width={this.props.width} animation={true}>
        <HorizontalGridLines />
        <LineSeries data={this.state.data}/>
        <XAxis />
        <YAxis />
      </XYPlot>
    );
  }
}

export default TelemetryGraph;
