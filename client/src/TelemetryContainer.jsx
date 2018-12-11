// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import TelemetryGraph from './TelemetryGraph';
import LegendItem from './LegendItem';

import colors from './model/colors';

class TelemetryContainer extends Component {
  static ModeHidden = 0;
  static ModeGraph = 1;
  static ModeValue = 2;

  static propTypes = {
    dataKey: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    range: PropTypes.array,
    historyLength: PropTypes.number.isRequired,
    historyLengthMultiplier: PropTypes.number.isRequired,
    subKeys: PropTypes.array,
    mode: PropTypes.number,
    onVisibilityChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { mode: this.props.mode, historyLength: this.props.historyLength };
  }

  toggleGraphVisible() {
    const newMode =
      this.state.mode === TelemetryContainer.ModeGraph ? TelemetryContainer.ModeHidden : TelemetryContainer.ModeGraph;
    this.setState({ mode: newMode }, () => {
      console.log(this.state.mode);
      this.props.onVisibilityChange(this.props.dataKey, this.state.mode);
    });
  }

  setHistoryLength(event) {
    this.setState({ historyLength: event.target.value });
  }

  render() {
    return (
      <div className='telemetry-container'>
        <span className='telemetry-container-description'>{this.props.description}</span>&nbsp;
        <ButtonGroup>
          <Button color='secondary' onClick={this.toggleGraphVisible.bind(this)}
            active={this.state.mode === TelemetryContainer.ModeGraph}>Graph</Button>
        </ButtonGroup>
        <br/>
        {this.state.mode === TelemetryContainer.ModeGraph &&
          <div>
            <span className='telemetry-container-body'>
              Duration:&nbsp;
              <Input className='telemetry-container-input' type='number' step='1'
                placeholder='Duration' defaultValue={this.props.historyLength}
                onChange={this.setHistoryLength.bind(this)}/>s
            </span>
            {this.props.subKeys.length > 0 &&
              <span className='telemetry-container-legend'>
                &nbsp;
                {this.props.subKeys.map((subKey, i) => (
                  <LegendItem key={subKey} color={colors.array[i]} title={subKey}/>
                ))}
              </span>
            }
            <TelemetryGraph
              height={100} width={300}
              dataKey={this.props.dataKey} historyLength={this.state.historyLength * this.props.historyLengthMultiplier}
              range={this.props.range}
            />
          </div>
        }
      </div>
    );
  }
}

export default TelemetryContainer;
