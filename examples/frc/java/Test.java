// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

import java.util.TimerTask;

public class Test {

  static TelemetryServer server = TelemetryServer.getInstance();

  public static void main(String[] args) {
    java.util.Timer t = new java.util.Timer();
    t.schedule(new TimerTask() {
      @Override
      public void run() {
        TelemetryDataPoint<String> dp = new TelemetryDataPoint("log", 1);
        server.send(dp);
      }
    }, 1000, 1000);
  }
}
