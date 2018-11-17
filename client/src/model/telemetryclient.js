// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

import EventEmitter from 'events';

class TelemetryClient extends EventEmitter {
  constructor() {
    super();
    this.dataPoints = {};
    this.dataPointsInitialized = false;

    const host = window.document.location.host.replace(/:.*/, '');
    this.ws = new WebSocket(`ws://${host}:8080`);

    this.ws.addEventListener('open', (e) => {
      console.log(`Telemetry server socket opened:`);
      console.table(e);
    });

    this.ws.addEventListener('message', this.handleIncomingData.bind(this));

    this.ws.addEventListener('error', (err) => {
      console.log(`Telemetry server socket error: ${err.message}`);
    });

    this.ws.addEventListener('close', (e) => {
      console.log(`Telemetry server socket closed:`);
      console.table(e);
    });
  }

  handleIncomingData(message) {
    const obj = JSON.parse(message.data);
    if (this.dataPointsInitialized) { // Recieving a data packet
      Object.entries(obj).forEach(([key, value]) => {
        this.dataPoints[key].value = value;
        this.emit('data', key, value);
      });
    } else { // Receiving first packet with metadata on data points
      console.table(obj);
      Object.entries(obj).forEach(([key, value]) => { // Only store the props we need
        this.dataPoints[key] = { isSampled: value.isSampled, updateIntervalMs: value.updateIntervalMs, value: 0 };
      });
      this.dataPointsInitialized = true;
    }
  }
}

export default new TelemetryClient();
