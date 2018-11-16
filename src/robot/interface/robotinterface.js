// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const EventEmitter = require('events');
const SerialPort = require('serialport');
const logger = require('../../logger');
const constants = require('../constants');
const Packet = require('./packet');
const types = require('./types');

function isFloat(value) {
  if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) return true;
  return false;
}

class RobotInterface extends EventEmitter {
  constructor() {
    super();
    this.serialBuffer = '';
    this.packetBuffer = [];
    this.serial = new SerialPort(constants.Port, { baudRate: constants.BaudRate }, (err) => {
      if (err) logger.error(err.message);
      else logger.info('Serial port opened.');
    });

    this.serial.on('error', (err) => {
      logger.error(err.message);
    });

    this.serial.on('data', (data) => {
      this.serialBuffer += data.toString().replace(/[\n\r]+/g, '');
      const newPackets = [];
      // Is the first char the start of a packet and is there a complete packet in the buffer?
      while (this.serialBuffer.length > 0 // Is there data?
             && this.serialBuffer.charAt(0) === constants.PacketMarker
             && this.serialBuffer.substr(1).indexOf('\\') > -1) {
        // Get string of next packet
        let packetStr = '';
        let char = '';
        let i = 1;
        while (char !== constants.PacketMarker) {
          char = this.serialBuffer.charAt(i);
          packetStr += char;
          i++;
        }
        this.serialBuffer = this.serialBuffer.substr(i);

        // Parse packet
        const type = parseInt(packetStr.substring(0, 3), 10);
        const rawData = packetStr.substring(4, packetStr.length - 1);
        let contents;
        if (type !== types.DataTypeHumanReadable && rawData.indexOf(constants.PacketSeparator) > -1) {
          const temp = rawData.split(constants.PacketSeparator);
          contents = [];
          for (i = 0; i < temp.length; i++) contents.push(parseFloat(temp[i]));
        } else {
          contents = isFloat(rawData) ? [parseFloat(rawData)] : rawData;
        }

        newPackets.push(new Packet(type, contents));
        this.packetBuffer.push(new Packet(type, contents));
      }
      logger.debug(`Recieved packets ${JSON.stringify(newPackets)}`);
      this.emit('data', newPackets);
    });
  }

  // Write packet
  writePacket(p) {
    let out = `${constants.PacketMarker}${String(p.type).padStart(3, 0)}`;
    if (Array.isArray(p.contents)) {
      out += p.contents.reduce((a, i) => `${a}${constants.PacketSeparator}${Math.round(i, 3)}`);
    } else out += `${constants.PacketSeparator}${p.value}`;
    out += constants.PacketMarker;
    logger.debug(`Wrote data ${out}`);
    this.serial.write(out);
  }

  // Write packet with raw contents
  writeRaw(data) {
    const out = `${constants.PacketSeparator}${data}${constants.PacketSeparator}`;
    logger.debug(`Wrote data ${out}`);
    this.serial.write(out);
  }

  // Read latest packets and clear buffer
  readPackets() {
    const ret = this.packetBuffer.slice(0);
    this.packetBuffer = [];
    return ret;
  }
}

module.exports = new RobotInterface();
