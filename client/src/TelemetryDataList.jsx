// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TelemetryContainer from './TelemetryContainer';
import telemetryClient from './model/telemetryclient';

const SortableTelemetryItem = SortableElement(TelemetryContainer);

const SortableList = SortableContainer(({items, dataPoints}) => {
  return (
    <ul>
      {items.map((k, i) => {
        const dp = dataPoints[k];
        return (
          <Row>
            <SortableTelemetryItem
              key={k}
              index={i}
              dataKey={k}
              description={dp.description}
              range={dp.range}
              historyLength={dp.historyLengthS}
              historyLengthMultiplier={1000 / dp.updateIntervalMs}
              subKeys={dp.subKeys}/>
          </Row>
        )
      })}
    </ul>
  );
});

class TelemetryDataList extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
    telemetryClient.on('ready', () => {
      this.setState({
        items: Object.keys(telemetryClient.dataPoints),
        dataPoints: telemetryClient.dataPoints,
      });
    })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  render() {
    return (
      <Container>
        <SortableList items={this.state.items} dataPoints={this.state.dataPoints} onSortEnd={this.onSortEnd}
          pressDelay={200} lockToContainerEdges={true} lockAxis='y'/>
      </Container>
    );
  }
}

export default TelemetryDataList;
