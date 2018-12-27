// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

package org.usfirst.frc.team0000.utility;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

/**
* Handles rx/tx of telemetry data on robot side
*/
public class TelemetryUDPServer {

  private static final TelemetryUDPServer instance = new TelemetryUDPServer();

	public static TelemetryUDPServer getInstance() {
		return instance;
	}

  private TelemetryUDPServer() {

  }
}
