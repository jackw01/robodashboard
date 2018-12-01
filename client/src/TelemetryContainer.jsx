// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import TelemetryGraph from './TelemetryGraph';
import LegendItem from './LegendItem';

import colors from './model/colors';

class TelemetryContainer extends Component {
  static propTypes = {
    dataKey: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    range: PropTypes.array,
    historyLength: PropTypes.number.isRequired,
    historyLengthMultiplier: PropTypes.number.isRequired,
    subKeys: PropTypes.array,
    visible: PropTypes.bool,
    onVisibilityChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { visible: this.props.visible, historyLength: this.props.historyLength };
  }

  toggleVisible() {
    this.setState({ visible: !this.state.visible }, () => {
      this.props.onVisibilityChange(this.props.dataKey, this.state.visible);
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
          <Button color='secondary' onClick={this.toggleVisible.bind(this)}
            active={this.state.visible}>Graph</Button>
        </ButtonGroup>
        <br/>
        {this.state.visible &&
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
