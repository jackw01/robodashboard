// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Button, ButtonGroup } from 'reactstrap';
import { FlexibleXYPlot, XAxis, YAxis, Hint, HorizontalGridLines, VerticalGridLines, LineSeries } from 'react-vis';

import telemetryClient from './model/telemetryclient';
import storage from './model/storage';
import colors from './model/colors';
import styles from './model/styles';

class LocationDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };

    window.addEventListener('resize', () => {

    });

    telemetryClient.on('ready', () => {

    });
  }

  updateDimensions() {
    this.setState({
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    return (
      <Card className='data-view location-data-view'>
        <CardBody>
          <CardTitle>Location</CardTitle>
          <div className='plot-flexible-container'>
            <FlexibleXYPlot height={400} animation={false} xDomain={[-100, 100]} yDomain={[-100, 100]}
              margin={{ left: 0, right: 0, top: 1, bottom: 1 }} dontCheckIfEmpty>
              <HorizontalGridLines style={styles.gridLines}/>
              <VerticalGridLines style={styles.gridLines}/>
              <LineSeries key='t' data={[{ x: 0, y: 0 }]} color={colors.primary}/>
              <XAxis top={200} style={styles.axes}/>
              <YAxis left={200} style={styles.axes}/>
            </FlexibleXYPlot>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default LocationDataView;
