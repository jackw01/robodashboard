// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TelemetryContainer from './TelemetryContainer';
import storage from './model/storage';
import telemetryClient from './model/telemetryclient';

const SortableTelemetryItem = SortableElement(TelemetryContainer);

const SortableList = SortableContainer(({ items, dataPoints, visibility, onVisibilityChange }) => {
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
            visible={visibility[k]}
            onVisibilityChange={onVisibilityChange}/>
        );
      })}
    </div>
  );
});

class TelemetryDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      visibilityToggle: storage.read('telemetryDataListVisibilityToggle', false),
    };

    telemetryClient.on('ready', () => {
      const visibility = {};
      Object.keys(telemetryClient.dataPoints).forEach((k) => { visibility[k] = false; });
      this.setState({
        items: storage.read('telemetryDataListOrder', Object.keys(telemetryClient.dataPoints)),
        visibility: storage.read('telemetryDataListVisibility', visibility),
        dataPoints: telemetryClient.dataPoints,
      });
    });
  }

  toggleAllGraphs() {
    this.setState((state) => {
      const newToggleState = !state.visibilityToggle;
      const newVisibility = state.visibility;
      Object.keys(newVisibility).forEach((k) => { newVisibility[k] = newToggleState; });
      storage.write('telemetryDataListVisibilityToggle', newToggleState);
      storage.write('telemetryDataListVisibility', newVisibility);
      return { visibility: newVisibility, visibilityToggle: newToggleState };
    });
  };

  onGraphVisibilityChange(key, newState) {
    this.setState((state) => {
      const newVisibility = state.visibility;
      newVisibility[key] = newState;
      storage.write('telemetryDataListVisibility', newVisibility);
      return { visibility: newVisibility };
    });
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({ items: arrayMove(this.state.items, oldIndex, newIndex) }, () => {
      storage.write('telemetryDataListOrder', this.state.items);
    });
  };

  render() {
    return (
      <Container className='telemetry-data-view'>
        <Row className='data-view-header'>
          <Col>
            <span className='data-view-title'>Telemetry</span>
            <br/>
            <Button color="secondary" onClick={this.toggleAllGraphs.bind(this)}
              active={this.state.visibilityToggle}>Toggle All</Button>
          </Col>
        </Row>
        <SortableList items={this.state.items} dataPoints={this.state.dataPoints}
          visibility={this.state.visibility} onVisibilityChange={this.onGraphVisibilityChange.bind(this)}
          key={this.state.visibilityToggle} onSortEnd={this.onSortEnd}
          pressDelay={200} lockToContainerEdges={true} lockAxis='y'/>
      </Container>
    );
  }
}

export default TelemetryDataView;
