// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

class Packet {
  constructor(type, contents) {
    this.type = type;
    this.contents = contents;
  }
}

module.exports = Packet;
