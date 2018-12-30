// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

/**
* Storage class for data points
*/
public class TelemetryDataPoint<T> {
  public String key;
  public T value;

  public TelemetryDataPoint(String k, T v) {
    key = k;
    value = v;
  }
}
