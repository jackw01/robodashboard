// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const winston = require('winston');

const logLevels = {
  error: 0, warn: 1, info: 2, debug: 3,
};
const consoleTransport = new winston.transports.Console({ colorize: true, timestamp: true });

module.exports = winston.createLogger({
  levels: logLevels,
  transports: [consoleTransport],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.padLevels({ levels: logLevels }),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}:${info.message}`),
  ),
  level: 'info',
});

module.exports.transport = consoleTransport;

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'cyan',
});
