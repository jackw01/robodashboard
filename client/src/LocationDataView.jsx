// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import ResizeAware from 'react-resize-aware';
import { Card, CardBody, CardTitle, Button, ButtonGroup, Input } from 'reactstrap';
import { FlexibleXYPlot, XAxis, YAxis, Hint, HorizontalGridLines, VerticalGridLines, PolygonSeries } from 'react-vis';
import HeadingIndicator from './HeadingIndicator';

import telemetryClient from './model/telemetryclient';
import storage from './model/storage';
import colors from './model/colors';
import styles from './model/styles';

class LocationDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      currentData: {},
      headingOffset: storage.read('headingOffset', 0),
    };

    this.eventHandler = this.handleIncomingData.bind(this);

    telemetryClient.on('ready', () => {
      const keys = Object.keys(telemetryClient.dashboardItems).filter((k) => {
        return telemetryClient.dashboardItems[k].type === 'location';
      });
      if (keys.length) telemetryClient.on(`data-${keys[0]}`, this.eventHandler);
    });
  }

  handleIncomingData(key, value) {
    this.setState({ currentData: value });
    console.log(value);
  }

  handleResize({ width, height }) {
    this.setState({ width, height });
  }

  setHeadingOffset(event) {
    const newOffset = parseFloat(event.target.value);
    storage.write('headingOffset', newOffset);
    this.setState({ headingOffset: newOffset });
  }

  render() {
    return (
      <Card className='data-view location-data-view'>
        <CardBody>
          <CardTitle>Location</CardTitle>
          <ResizeAware className='plot-flexible-container' onlyEvent onResize={this.handleResize.bind(this)}>
            <HeadingIndicator width={40} height={40} radius={16}
              heading={this.state.currentData.rawHeading + this.state.headingOffset}/>
            <FlexibleXYPlot height={400} animation={false} xDomain={[-100, 100]} yDomain={[-100, 100]}
              margin={{ left: 0, right: 0, top: 1, bottom: 1 }} dontCheckIfEmpty>
              <HorizontalGridLines style={styles.gridLines}/>
              <VerticalGridLines style={styles.gridLines}/>
              <XAxis top={200} style={styles.axes}/>
              <YAxis left={this.state.width / 2} style={styles.axes}/>
              <PolygonSeries className="polygon-series-example" data={[{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 0, y: 20 }]} style={styles.robotPath}/>
            </FlexibleXYPlot>
          </ResizeAware>
          <br/>
          <div>
            Heading Offset:&nbsp;
            <Input className='input-inline-short' type='number' step='0.01' bsSize="sm"
              placeholder='Heading Offset' defaultValue={this.state.headingOffset}
              onChange={this.setHeadingOffset.bind(this)}/>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default LocationDataView;
