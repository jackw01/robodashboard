// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import prettyMs from 'pretty-ms';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, AreaSeries, LineSeries, GradientDefs } from 'react-vis';

import telemetryClient from './model/telemetryclient';
import colors from './model/colors';
import styles from './model/styles';

class TelemetryGraph extends Component {
  static propTypes = {
    dataKey: PropTypes.string.isRequired,
    unitSymbol: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    valueRange: PropTypes.array,
    historyLength: PropTypes.number.isRequired,
    valueOnly: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const data = {};
    this.state = {
      data: data,
      timestamps: {},
      ready: {},
      lastHistoryLength: 0,
    };
    this.eventHandler = this.handleIncomingData.bind(this);
  }

  componentDidMount() {
    telemetryClient.on(`data-${this.props.dataKey}`, this.eventHandler);
  }

  componentWillUnmount() {
    telemetryClient.removeListener(
      `data-${this.props.dataKey}`,
      this.eventHandler
    );
  }

  handleIncomingData(key, value, timestamp) {
    this.setState((state) => {
      let ready = state.ready;
      if (state.lastHistoryLength !== this.props.historyLength) ready = {};
      let data = state.data;
      let timestamps = state.timestamps;
      if (typeof value === "object" && value) {
        Object.entries(value).forEach(([k, v]) => {
          if (!ready[k]) {
            timestamps[k] = timestamp;
            data[k] = [];
            for (let x = -this.props.historyLength; x < 0; x++)
              data[k].push([x, 0]);
            ready[k] = true;
          }
          data[k].shift();
          data[k].push([timestamp - timestamps[k], v]);
        });
      } else {
        if (!ready[this.props.dataKey]) {
          timestamps[this.props.dataKey] = timestamp;
          data[this.props.dataKey] = [];
          for (let x = -this.props.historyLength; x < 0; x++)
            data[this.props.dataKey].push([x, 0]);
          ready[this.props.dataKey] = true;
        }
        data[this.props.dataKey].shift();
        data[this.props.dataKey].push([
          timestamp - timestamps[this.props.dataKey],
          value,
        ]);
      }
      return {
        data: data,
        timestamps: timestamps,
        ready: ready,
        lastHistoryLength: this.props.historyLength,
      };
    });
  }

  render() {
    const graphType = Object.keys(this.state.data).length === 1;
    return (
      <div>
        {!this.props.valueOnly && (
          <XYPlot
            height={this.props.height}
            width={this.props.width}
            animation={false}
            yDomain={this.props.valueRange}
            getX={(d) => d[0]}
            getY={(d) => d[1]}
          >
            <GradientDefs>
              <linearGradient id="colorGradient1" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors.primary}
                  stopOpacity={0.75}
                />
                <stop offset="100%" stopColor="black" stopOpacity={0} />
              </linearGradient>
            </GradientDefs>
            <HorizontalGridLines style={styles.gridLines} />
            {Object.keys(this.state.data).map((k, i) => {
              if (graphType)
                return (
                  <AreaSeries
                    key={k}
                    data={this.state.data[k]}
                    color={colors.array[i]}
                    fill={
                      Object.keys(this.state.data).length === 1
                        ? "url(#colorGradient1)"
                        : ""
                    }
                  />
                );
              else
                return (
                  <LineSeries
                    key={k}
                    data={this.state.data[k]}
                    color={colors.array[i]}
                  />
                );
            })}
            <XAxis
              style={styles.axes}
              position="start"
              tickFormat={prettyMs}
              title={Object.keys(this.state.data)
                .map((k, i) => {
                  if (this.state.data[k].length > 0) {
                    return this.state.data[k][
                      this.state.data[k].length - 1
                    ][1].toFixed(2);
                  } else return "";
                })
                .join(", ")}
            />
            <YAxis style={styles.axes} />
          </XYPlot>
        )}
        {this.props.valueOnly && (
          <div className="telemetry-value-text">
            {Object.keys(this.state.data).map((k, i) => {
              if (this.state.data[k].length > 0) {
                return (
                  <span key={k}>
                    <span style={{ color: colors.array[i] }}>
                      {this.state.data[k][
                        this.state.data[k].length - 1
                      ][1].toFixed(2)}
                      {this.props.unitSymbol}
                    </span>
                    {i < Object.keys(this.state.data).length - 1 ? " " : ""}
                  </span>
                );
              } else return "";
            })}
          </div>
        )}
      </div>
    );
  }
}

export default TelemetryGraph;
