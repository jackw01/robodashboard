// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TelemetryContainer from './TelemetryContainer';

import telemetryClient from './model/telemetryclient';
import storage from './model/storage';

const SortableTelemetryItem = SortableElement(TelemetryContainer);

const SortableList = SortableContainer(({ items, dashboardItems, mode, onVisibilityChange }) => {
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
            unitSymbol={dp.unitSymbol}
            range={dp.range}
            historyLength={dp.historyLengthS}
            historyLengthMultiplier={1000 / dp.updateIntervalMs}
            subKeys={dp.subKeys}
            mode={mode[k]}
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
      const mode = {};
      Object.keys(telemetryClient.dashboardItems).forEach((k) => { mode[k] = TelemetryContainer.ModeHidden; });
      const keys = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].showGraph;
      });
      // Invalidate stuff in storage if keys have changed
      if (storage.read('telemetryDataListOrder', []).length !== keys.length) {
        storage.write('telemetryDataListOrder', keys);
      }
      this.setState({
        items: storage.read('telemetryDataListOrder', keys),
        mode: storage.read('telemetryDataListVisibility', mode),
        dashboardItems: telemetryClient.dashboardItems,
      });
    });
  }

  toggleAllGraphs() {
    this.setState((state) => {
      const newToggleState = TelemetryContainer.ModeHidden; // Fix
      const newMode = state.mode;
      Object.keys(newMode).forEach((k) => { newMode[k] = newToggleState; });
      storage.write('telemetryDataListVisibilityToggle', newToggleState);
      storage.write('telemetryDataListVisibility', newMode);
      return { visibility: newMode, visibilityToggle: newToggleState };
    });
  };

  onVisibilityChange(key, newState) {
    this.setState((state) => {
      const newMode = state.mode;
      newMode[key] = newState;
      storage.write('telemetryDataListVisibility', newMode);
      return { mode: newMode };
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
          <CardTitle>
            Telemetry
            <Button color='secondary' onClick={this.toggleAllGraphs.bind(this)}
            active={this.state.visibilityToggle}>Toggle All</Button>
          </CardTitle>
          <SortableList items={this.state.items} dashboardItems={this.state.dashboardItems}
            mode={this.state.mode} onVisibilityChange={this.onVisibilityChange.bind(this)}
            key={this.state.visibilityToggle} onSortEnd={this.onSortEnd}
            pressDelay={200} lockToContainerEdges={true} lockAxis='y'/>
        </CardBody>
      </Card>
    );
  }
}

export default TelemetryDataView;
