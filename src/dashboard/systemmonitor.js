// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const EventEmitter = require('events');
const si = require('systeminformation');

// For reporting server CPU/RAM to dashboard
class SystemMonitor extends EventEmitter {
  constructor(updateInterval) {
    super();
    if (updateInterval) this.interval = setInterval(this.update.bind(this), updateInterval);
  }

  update() {
    si.currentLoad((data) => {
      this.emit('telemetry', 'serverCPUUsage', data.currentload);
    });
    si.mem((data) => {
      this.emit('telemetry', 'serverFreeRAM', data.free / 1048576.0);
    });
  }
}

module.exports = SystemMonitor;
