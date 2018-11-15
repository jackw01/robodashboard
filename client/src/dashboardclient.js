// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

class DashboardClient {
  constructor() {
    const host = window.document.location.host.replace(/:.*/, '');
    this.ws = new WebSocket(`ws://${host}:8080`);

    this.ws.addEventListener('open', (e) => {
      console.log(`Telemetry server socket opened: ${e}`);
    });

    this.ws.addEventListener('error', (err) => {
      console.log(`Telemetry server socket error: ${err}`);
    });

    this.ws.addEventListener('close', (e) => {
      console.log(`Telemetry server socket closed: ${e}`);
    });
  }
}

export default new DashboardClient();
