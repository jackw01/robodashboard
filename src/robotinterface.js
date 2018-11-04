// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const SerialPort = require('serialport');
const logger = require('./logger');

const Port = 'COM3'; // '/dev/ttyAMA0';
const BaudRate = 115200;

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
    this.serial = new SerialPort(Port, { BaudRate }, (err) => {
      if (err) logger.error(err);
      else logger.info('Serial port opened.');
    });

    this.serial.on('data', (data) => {
      this.serialBuffer += data.toString().replace(/[\n\r]+/g, '');
      const newPackets = [];
      // Is the first char the start of a packet and is there a complete packet in the buffer?
      while (this.serialBuffer.length > 0 // Is there data?
             && this.serialBuffer.charAt(0) === '\\' && this.serialBuffer.substr(1).indexOf('\\') > -1) {
        // Get string of next packet
        let packetStr = '';
        let char = '';
        let i = 1;
        while (char !== '\\') {
          char = this.serialBuffer.charAt(i);
          packetStr += char;
          i++;
        }
        this.serialBuffer = this.serialBuffer.substr(i);

        // Parse packet
        const type = parseInt(packetStr.substring(0, 3), 10);
        const rawData = packetStr.substring(4, packetStr.length - 1);
        let contents;
        if (type !== DataTypeHumanReadable && rawData.indexOf(' ') > -1) {
          const temp = rawData.split(' ');
          contents = [];
          for (i = 0; i < temp.length; i++) data.push(parseFloat(temp[i]));
        } else {
          contents = rawData;
        }

        newPackets.push({ type, contents });
        this.packetBuffer.push({ type, contents });
      }
    });
  }
}

module.exports = new RobotInterface();
