// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

public class TelemetryServerTest {

  static TelemetryServer server = TelemetryServer.getInstance();

  public static void main(String[] args) {
    while (true) {
      TelemetryDataPoint<String> dp = new TelemetryDataPoint("log", "1");
      server.send(dp);
    }
  }
}
