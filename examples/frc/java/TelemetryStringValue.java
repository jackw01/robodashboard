// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

/**
* Storage class for data strings
*/
public class TelemetryStringValue<T> {
  public String key;
  public String value;

  public TelemetryStringValue(String k, String v) {
    key = k;
    value = v;
  }
}
