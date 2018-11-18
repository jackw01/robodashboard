import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TelemetryGraph from './TelemetryGraph';

class TelemetryContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='telemetry-container'>
        <span className='telemetry-container-description'>{this.props.description}</span><br/>
        <span className='telemetry-container-title'>{this.props.dataKey}</span>
        <TelemetryGraph
          height={100} width={300}
          dataKey={this.props.dataKey} historyLength={this.props.historyLength}
        />
      </div>
    );
  }
}

export default TelemetryContainer;
