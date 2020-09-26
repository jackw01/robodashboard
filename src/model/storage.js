// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).

// For storing user preference data
class Storage {
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  read(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  }
}

export default new Storage();
