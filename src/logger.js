// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

const winston = require('winston');

const logLevels = {
  error: 0, warn: 1, info: 2, debug: 3,
};

module.exports = winston.createLogger({
  levels: logLevels,
  transports: [
    new winston.transports.Console({ colorize: true, timestamp: true }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.padLevels({ levels: logLevels }),
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}:${info.message}`),
  ),
  level: 'debug',
});

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'cyan',
});
