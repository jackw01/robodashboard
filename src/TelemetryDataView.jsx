// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap';
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
            valueRange={dp.valueRange}
            historyLength={dp.historyLengthS}
            historyLengthMultiplier={1 / dp.sampleIntervalS}
            valueNames={dp.valueNames}
            mode={mode[k]}
            onVisibilityChange={onVisibilityChange}
          />
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
      toggle: storage.read('telemetryDataListToggle', TelemetryContainer.ModeHidden),
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

  toggleGraphVisible() {
    this.setState((state) => {
      const newToggleState =
        state.toggle === TelemetryContainer.ModeGraph ? TelemetryContainer.ModeHidden : TelemetryContainer.ModeGraph;
      const newMode = state.mode;
      Object.keys(newMode).forEach((k) => { newMode[k] = newToggleState; });
      storage.write('telemetryDataListToggle', newToggleState);
      storage.write('telemetryDataListVisibility', newMode);
      return { mode: newMode, toggle: newToggleState };
    });
  };

  toggleValueVisible() {
    this.setState((state) => {
      const newToggleState =
        state.toggle === TelemetryContainer.ModeValue ? TelemetryContainer.ModeHidden : TelemetryContainer.ModeValue;
      const newMode = state.mode;
      Object.keys(newMode).forEach((k) => { newMode[k] = newToggleState; });
      storage.write('telemetryDataListToggle', newToggleState);
      storage.write('telemetryDataListVisibility', newMode);
      return { mode: newMode, toggle: newToggleState };
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
            <ButtonGroup>
              <Button color='secondary' onClick={this.toggleGraphVisible.bind(this)}
                active={this.state.toggle === TelemetryContainer.ModeGraph}>Toggle All Graphs</Button>
              <Button color='secondary' onClick={this.toggleValueVisible.bind(this)}
                active={this.state.toggle === TelemetryContainer.ModeValue}>Toggle All Values</Button>
            </ButtonGroup>
          </CardTitle>
          <SortableList items={this.state.items} dashboardItems={this.state.dashboardItems}
            mode={this.state.mode} onVisibilityChange={this.onVisibilityChange.bind(this)}
            key={this.state.toggle} onSortEnd={this.onSortEnd}
            pressDelay={200} lockToContainerEdges={true} lockAxis='y'/>
        </CardBody>
      </Card>
    );
  }
}

export default TelemetryDataView;
