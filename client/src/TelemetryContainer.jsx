import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryGraph from './TelemetryGraph';

class TelemetryContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <TelemetryGraph
        height={100} width={300}
        telemetryKey={this.props.telemetryKey} historyLength={this.props.historyLength}
      />
    );
  }
}

export default TelemetryContainer;
