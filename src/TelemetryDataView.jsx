// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2020 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap';
import { List, arrayMove } from "react-movable";
import TelemetryContainer from './TelemetryContainer';

import telemetryClient from './model/telemetryclient';
import storage from './model/storage';

class TelemetryDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      toggle: storage.read('telemetryDataListToggle', TelemetryContainer.ModeHidden),
    };
  }

  componentDidMount() {
    telemetryClient.on("ready", () => {
      const mode = {};
      Object.keys(telemetryClient.dashboardItems).forEach((k) => {
        mode[k] = TelemetryContainer.ModeHidden;
      });
      const keys = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].showGraph;
      });
      // Invalidate stuff in storage if keys have changed
      if (storage.read("telemetryDataListOrder", []).length !== keys.length) {
        storage.write("telemetryDataListOrder", keys);
      }
      this.setState({
        items: storage.read("telemetryDataListOrder", keys),
        mode: storage.read("telemetryDataListVisibility", mode),
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
      <Card className="data-view telemetry-data-view">
        <CardBody>
          <CardTitle>
            <ButtonGroup>
              <Button
                color="secondary"
                onClick={this.toggleGraphVisible.bind(this)}
                active={this.state.toggle === TelemetryContainer.ModeGraph}
              >
                Toggle All Graphs
              </Button>
              <Button
                color="secondary"
                onClick={this.toggleValueVisible.bind(this)}
                active={this.state.toggle === TelemetryContainer.ModeValue}
              >
                Toggle All Values
              </Button>
            </ButtonGroup>
          </CardTitle>
          <List
            key={this.state.toggle}
            values={this.state.items}
            onChange={this.onSortEnd}
            renderList={({ children, props }) => (
              <div {...props}>{children}</div>
            )}
            renderItem={({ value, props }) => {
              const dp = this.state.dashboardItems[value];
              return (
                <div {...props}>
                  <TelemetryContainer
                    key={value}
                    dataKey={value}
                    description={dp.description}
                    unitSymbol={dp.unitSymbol}
                    valueRange={dp.valueRange}
                    historyLength={dp.historyLengthS}
                    historyLengthMultiplier={1 / dp.sampleIntervalS}
                    valueNames={dp.valueNames}
                    mode={this.state.mode[value]}
                    onVisibilityChange={this.onVisibilityChange.bind(this)}
                  />
                </div>
              );
            }}
          />
        </CardBody>
      </Card>
    );
  }
}

export default TelemetryDataView;
