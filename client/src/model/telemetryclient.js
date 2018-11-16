// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

class TelemetryClient {
  constructor() {
    this.dataPoints = {};
    this.dataPointsInitialized = false;

    const host = window.document.location.host.replace(/:.*/, '');
    this.ws = new WebSocket(`ws://${host}:8080`);

    this.ws.addEventListener('open', (e) => {
      console.log(`Telemetry server socket opened:`);
      console.table(e);
    });

    this.ws.addEventListener('message', this.handleIncomingData);

    this.ws.addEventListener('error', (err) => {
      console.log(`Telemetry server socket error: ${err.message}`);
    });

    this.ws.addEventListener('close', (e) => {
      console.log(`Telemetry server socket closed:`);
      console.table(e);
    });
  }

  handleIncomingData(data) {
    if (this.dataPointsInitialized) {
      Object.entries(data).forEach(([key, value]) => {
        this.dataPoints[key].value = value;
      });
    } else {
      // Receiving packet to set up data point metadata
      console.table(data);
    }
  }
}

export default new TelemetryClient();
