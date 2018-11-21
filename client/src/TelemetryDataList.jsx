// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TelemetryContainer from './TelemetryContainer';
import telemetryClient from './model/telemetryclient';

const SortableTelemetryItem = SortableElement(TelemetryContainer);

const SortableList = SortableContainer(({ items, dataPoints, visible }) => {
  return (
    <div>
      {items.map((k, i) => {
        const dp = dataPoints[k];
        return (
          <SortableTelemetryItem
            key={k}
            index={i}
            dataKey={k}
            description={dp.description}
            range={dp.range}
            historyLength={dp.historyLengthS}
            historyLengthMultiplier={1000 / dp.updateIntervalMs}
            subKeys={dp.subKeys}
            visible={visible}/>
        );
      })}
    </div>
  );
});

class TelemetryDataList extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, items: [] };
    telemetryClient.on('ready', () => {
      this.setState({
        items: Object.keys(telemetryClient.dataPoints),
        dataPoints: telemetryClient.dataPoints,
      });
    })
  }

  toggleGraphs() {
    this.setState({ items: this.state.items, visible: !this.state.visible });
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({ items: arrayMove(this.state.items, oldIndex, newIndex) });
  };

  render() {
    return (
      <Container className='telemetry-data-list'>
        <Row>
          <Col>
            <span className='telemetry-data-list-title'>Telemetry</span>
            <br/>
            <Button color="primary" onClick={this.toggleGraphs.bind(this)}
              active={this.state.visible}>Graph All</Button>
          </Col>
        </Row>
        <hr/>
        <SortableList items={this.state.items} dataPoints={this.state.dataPoints}
          visible={this.state.visible} key={this.state.visible} onSortEnd={this.onSortEnd}
          pressDelay={200} lockToContainerEdges={true} lockAxis='y'/>
      </Container>
    );
  }
}

export default TelemetryDataList;
