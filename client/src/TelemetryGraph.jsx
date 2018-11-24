// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, Hint, HorizontalGridLines, LineSeries } from 'react-vis';
import PropTypes from 'prop-types';
import telemetryClient from './model/telemetryclient';
import colors from './model/colors';
import styles from './model/styles';

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
    this.eventHandler = this.handleIncomingData.bind(this);
    telemetryClient.on(`data-${this.props.dataKey}`, this.eventHandler);
  }

  componentWillUnmount() {
    telemetryClient.removeListener(`data-${this.props.dataKey}`, this.eventHandler);
  }

  handleIncomingData(value) {
    this.setState((state) => {
      let ready = state.ready;
      if (state.lastHistoryLength !== this.props.historyLength) ready = false;
      const data = state.data;
      if (typeof value === 'object') {
        Object.entries(value).forEach(([key, value]) => {
          if (!ready) {
            data[key] = [];
            for (let x = -this.props.historyLength; x < 0; x++) data[key].push([x, 0]);
          }
          data[key].shift();
          data[key].push([data[key][data[key].length - 1][0] + 1, value]);
        });
      } else {
        if (!ready) {
          data[this.props.dataKey] = [];
          for (let x = -this.props.historyLength; x < 0; x++) data[this.props.dataKey].push([x, 0]);
        }
        data[this.props.dataKey].shift();
        data[this.props.dataKey].push([data[this.props.dataKey][data[this.props.dataKey].length - 1][0] + 1, value]);
      }
      return { data: data, ready: true, lastHistoryLength: this.props.historyLength };
    });
  }

  render() {
    return (
      <XYPlot height={this.props.height} width={this.props.width} animation={false} yDomain={this.props.range}
        getX={(d) => d[0]} getY={(d) => d[1]}>
        <HorizontalGridLines style={styles.gridLines}/>
        {Object.keys(this.state.data).map((k, i) => (
          <LineSeries key={k} data={this.state.data[k]} color={colors.array[i]}/>
        ))}
        <XAxis style={styles.axes}/>
        <YAxis style={styles.axes}/>
      </XYPlot>
    );
  }
}

export default TelemetryGraph;
