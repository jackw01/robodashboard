import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';
import telemetryClient from './model/telemetryclient';

class TelemetryGraph extends Component {
  constructor(props) {
    super(props);
    const data = {};
    this.state = { data: data, ready: false };
    telemetryClient.on('data', this.handleIncomingData.bind(this));
  }

  handleIncomingData(key, value) {
    if (key === this.props.telemetryKey) {
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
            data[this.props.telemetryKey] = [];
            for (let x = 0; x < this.props.historyLength; x++) data[this.props.telemetryKey].push({ x: x, y: 0 });
          }
          for (let x = 0; x < this.props.historyLength - 1; x++) {
            data[this.props.telemetryKey][x].y = data[this.props.telemetryKey][x + 1].y;
          }
          data[this.props.telemetryKey][this.props.historyLength - 1].y = value;
        }
        return { data: data, ready: true };
      });
    }
  }

  render() {
    const series = [];
    Object.entries(this.state.data).forEach(([key, value]) => {
      series.push(<LineSeries data={this.state.data[key]}/>);
    });
    return (
      <XYPlot height={this.props.height} width={this.props.width} animation={true}>
        <HorizontalGridLines />
        {series}
        <XAxis />
        <YAxis />
      </XYPlot>
    );
  }
}

export default TelemetryGraph;
