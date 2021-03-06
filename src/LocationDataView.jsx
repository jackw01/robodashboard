// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import React, { Component } from 'react';
import ResizeAware from 'react-resize-aware';
import { Card, CardBody, Button, ButtonGroup, Input } from 'reactstrap';
import { FlexibleXYPlot, XAxis, YAxis, Highlight, HorizontalGridLines, VerticalGridLines, MarkSeries } from 'react-vis';
import OpenPolygonSeries from './OpenPolygonSeries';
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
      odometryHistory: [],
      headingOffset: storage.read('headingOffset', 0),
      positionOffset: { x: 0, y: 0 },
      bounds: { left: -200, right: 200, top: 200, bottom: -200 },
      clientX: 0,
      clientY: 0,
      isScrolling: false,
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
    this.setState((state) => {
      let newOdometryHistory = state.odometryHistory;
      let positionOffset = state.positionOffset;
      if (value.reset) {
        newOdometryHistory = [];
        positionOffset = { x: 0, y: 0 };
      }
      const lastTransform = newOdometryHistory[newOdometryHistory.length - 1] || { translation: { x: 0, y: 0 } };
      if (value.transform.translation.x !== lastTransform.translation.x ||
        value.transform.translation.y !== lastTransform.translation.y) {
        newOdometryHistory.push(value.transform);
      }
      return { currentData: value, odometryHistory: newOdometryHistory, positionOffset: positionOffset };
    });
  }

  handleResize({ width, height }) {
    this.setState({ width, height });
  }

  onMouseDown(event) {
    this.setState({ clientX: event.clientX, clientY: event.clientY, isScrolling: true });
    event.persist();
  };

  onMouseMove(event) {
    if (this.state.isScrolling && event.buttons & 0x04) { // Bitmask bit 4 is middle click
      this.setState((state) => {
        const newBounds = state.bounds;
        const rateX = event.clientX - state.clientX;
        const rateY = event.clientY - state.clientY;
        newBounds.left += rateX * -1;
        newBounds.right += rateX * -1;
        newBounds.top += rateY * 1;
        newBounds.bottom += rateY * 1;
        return { bounds: newBounds, clientX: event.clientX, clientY: event.clientY };
      });
    }
    event.persist();
  }

  onMouseUp(event) {
    this.setState({ clientX: 0, clientY: 0, isScrolling: false });
    event.persist();
  }

  onWheel(event) {
    this.setState((state) => {
      const newBounds = state.bounds;
      const rate = event.deltaY;
      if (newBounds.left + rate < newBounds.right - rate &&
        newBounds.top - rate > newBounds.bottom + rate) {
        newBounds.left += rate;
        newBounds.right -= rate;
        newBounds.top -= rate;
        newBounds.bottom += rate;
      }
      return { bounds: newBounds };
    });
    event.persist();
  }

  resetBounds() {
    this.setState((state) => {
      const newBounds = state.bounds;
      const width = newBounds.right - newBounds.left;
      const height = newBounds.top - newBounds.bottom;
      newBounds.left = -(width / 2.0);
      newBounds.right = (width / 2.0);
      newBounds.top = (height / 2.0);
      newBounds.bottom = -(height / 2.0);
      return { bounds: newBounds };
    });
  }

  zeroPosition(event) {
    if (this.state.currentData.transform) {
      this.setState({ positionOffset: {
        x: -this.state.currentData.transform.translation.x,
        y: -this.state.currentData.transform.translation.y,
      }});
    }
  }

  setHeadingOffset(event) {
    const newOffset = parseFloat(event.target.value);
    storage.write('headingOffset', newOffset);
    this.setState({ headingOffset: newOffset });
  }

  getOffsetX(d) {
    return (d.translation.x + this.state.positionOffset.x) * Math.cos(this.state.headingOffset) -
           (d.translation.y + this.state.positionOffset.y) * Math.sin(this.state.headingOffset);
  }

  getOffsetY(d) {
    return (d.translation.x + this.state.positionOffset.x) * Math.sin(this.state.headingOffset) +
           (d.translation.y + this.state.positionOffset.y) * Math.cos(this.state.headingOffset);
  }

  render() {
    return (
      <Card className='data-view location-data-view'>
        <CardBody>
          <ResizeAware className='plot-flexible-container' onlyEvent onResize={this.handleResize.bind(this)} >
            <HeadingIndicator width={40} height={40} radius={16}
              heading={this.state.currentData.rawHeading - this.state.headingOffset}/>
            <FlexibleXYPlot height={400} animation={false}
              xDomain={[this.state.bounds.left, this.state.bounds.right]}
              yDomain={[this.state.bounds.bottom, this.state.bounds.top]}
              margin={{ left: 0, right: 0, top: 1, bottom: 1 }} dontCheckIfEmpty
              onMouseDown={this.onMouseDown.bind(this)}
              onMouseMove={this.onMouseMove.bind(this)}
              onMouseUp={this.onMouseUp.bind(this)}
              onWheel={this.onWheel.bind(this)}>
              <HorizontalGridLines style={styles.gridLines}/>
              <VerticalGridLines style={styles.gridLines}/>
              <XAxis top={200} style={styles.axes}/>
              <YAxis left={this.state.width / 2} style={styles.axes}/>
              <OpenPolygonSeries style={styles.robotPath} data={this.state.odometryHistory}
                getX={this.getOffsetX.bind(this)} getY={this.getOffsetY.bind(this)}/>
              <MarkSeries size={3} style={styles.robotPosition}
                data={this.state.currentData.transform ? [this.state.currentData.transform] : []}
                getX={this.getOffsetX.bind(this)} getY={this.getOffsetY.bind(this)}/>
            </FlexibleXYPlot>
          </ResizeAware>
          <br/>
          <div>
            <Button color='secondary' size='sm' onClick={this.resetBounds.bind(this)}>Recenter</Button>
            &nbsp;
            <Button color='secondary' size='sm' onClick={this.zeroPosition.bind(this)}>Zero Position</Button>
            &nbsp;
            Heading Offset:&nbsp;
            <Input className='input-inline-short' type='number' step='0.01' bsSize='sm'
              placeholder='Heading Offset' defaultValue={this.state.headingOffset}
              onChange={this.setHeadingOffset.bind(this)}/>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default LocationDataView;
