// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Input } from 'reactstrap';
import TelemetryGraph from './TelemetryGraph';
import LegendItem from './LegendItem';
import colors from './model/colors';

class TelemetryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { graph: false, historyLength: this.props.historyLength };
  }

  toggleGraph(select) {
    this.setState({ graph: !this.state.graph });
  }

  setHistoryLength(event) {
    this.setState({ historyLength: event.target.value });
  }

  render() {
    return (
      <div className='telemetry-container'>
        <span className='telemetry-container-description'>{this.props.description}</span>
        <ButtonGroup>
          <Button color="primary" onClick={this.toggleGraph.bind(this)}
            active={this.state.graph}>Graph</Button>
        </ButtonGroup>
        <br/>
        {this.state.graph &&
          <Input className='telemetry-container-input' type="number" step="1"
            placeholder="Duration" defaultValue={this.props.historyLength} onChange={this.setHistoryLength.bind(this)}/>
        }
        {(this.state.graph && this.props.subKeys.length) > 0 &&
          <span className='telemetry-container-legend'>
            &nbsp;
            {this.props.subKeys.map((subKey, i) => (
              <LegendItem color={colors.array[i]} title={subKey}/>
            ))}
          </span>
        }
        {this.state.graph &&
          <TelemetryGraph
            height={100} width={300}
            dataKey={this.props.dataKey} historyLength={this.state.historyLength * this.props.historyLengthMultiplier}
            range={this.props.range}
          />
        }
      </div>
    );
  }
}

export default TelemetryContainer;
