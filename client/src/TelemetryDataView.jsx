// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col, Button, ButtonGroup } from 'reactstrap';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TelemetryContainer from './TelemetryContainer';
import storage from './model/storage';
import telemetryClient from './model/telemetryclient';

const SortableTelemetryItem = SortableElement(TelemetryContainer);

const SortableList = SortableContainer(({ items, dashboardItems, visibility, onVisibilityChange }) => {
  return (
    <div>
      {items.map((k, i) => {
        const dp = dashboardItems[k];
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
      Object.keys(telemetryClient.dashboardItems).forEach((k) => { visibility[k] = false; });
      const keys = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].showGraph;
      });
      // Invalidate stuff in storage if keys have changed
      if (storage.read('telemetryDataListOrder', []).length !== keys.length) {
        storage.write('telemetryDataListOrder', keys);
      }
      this.setState({
        items: storage.read('telemetryDataListOrder', keys),
        visibility: storage.read('telemetryDataListVisibility', visibility),
        dashboardItems: telemetryClient.dashboardItems,
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
      <Card className='data-view telemetry-data-view'>
        <CardBody>
          <CardTitle>Telemetry</CardTitle>
          <Button color="secondary" onClick={this.toggleAllGraphs.bind(this)}
            active={this.state.visibilityToggle}>Toggle All</Button>
          <br/><br/>
          <SortableList items={this.state.items} dashboardItems={this.state.dashboardItems}
            visibility={this.state.visibility} onVisibilityChange={this.onGraphVisibilityChange.bind(this)}
            key={this.state.visibilityToggle} onSortEnd={this.onSortEnd}
            pressDelay={200} lockToContainerEdges={true} lockAxis='y'/>
        </CardBody>
      </Card>
    );
  }
}

export default TelemetryDataView;
