// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const SerialPort = require('serialport');
const logger = require('./logger');

const Port = 'COM3'; // '/dev/ttyAMA0';
const BaudRate = 115200;
const PacketMarker = '\\';
const PacketSeparator = ' ';

const DataTypeHumanReadable = 0;
const DataTypeBatteryVoltage = 1;
const DataTypeGyro = 2;
const DataTypeDriveDistance = 3;
const DataTypeDriveControlData = 4;
const DataTypeFreeRAM = 5;

const CmdTypeSetDriveOpenLoop = 0;
const CmdTypeSetDriveClosedLoop = 1;
const CmdTypeEnableDriveClosedLoop = 2;
const CmdTypeDisableDriveClosedLoop = 3;
const CmdTypeSetDrivePIDTuning = 4;
const CmdTypeSetAllStatusLEDs = 5;
const CmdTypeCalibrateGyro = 6;

class RobotInterface {
  constructor() {
    this.serialBuffer = '';
    this.packetBuffer = [];
    this.serial = new SerialPort(Port, { baudRate: BaudRate }, (err) => {
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
             && this.serialBuffer.charAt(0) === PacketMarker && this.serialBuffer.substr(1).indexOf('\\') > -1) {
        // Get string of next packet
        let packetStr = '';
        let char = '';
        let i = 1;
        while (char !== PacketMarker) {
          char = this.serialBuffer.charAt(i);
          packetStr += char;
          i++;
        }
        this.serialBuffer = this.serialBuffer.substr(i);

        // Parse packet
        const type = parseInt(packetStr.substring(0, 3), 10);
        const rawData = packetStr.substring(4, packetStr.length - 1);
        let contents;
        if (type !== DataTypeHumanReadable && rawData.indexOf(PacketSeparator) > -1) {
          const temp = rawData.split(PacketSeparator);
          contents = [];
          for (i = 0; i < temp.length; i++) contents.push(parseFloat(temp[i]));
        } else {
          contents = rawData;
        }

        newPackets.push({ type, contents });
        this.packetBuffer.push({ type, contents });
        logger.debug(`Recieved packets ${JSON.stringify(newPackets)}`);
      }
    });
  }

  writePacket(p) {
    let out = `${PacketMarker}${p.key.padStart(3, 0)}`;
    if (Array.isArray(p.value)) out += p.value.reduce((a, i) => `${a}${PacketSeparator}${Math.round(i, 3)}`);
    else out += `${PacketSeparator}${p.value}`;
    out += PacketMarker;
    logger.debug(`Wrote data ${out}`);
    this.serial.write(out);
  }
}

module.exports = new RobotInterface();
