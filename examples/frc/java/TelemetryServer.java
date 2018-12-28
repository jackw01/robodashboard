// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

package org.usfirst.frc.team0000.utility;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

/**
* Handles rx/tx of telemetry data on robot side
*/
public class TelemetryServer {

  public static class TelemetryDataPoint {
		public String key;
		public double value;
	}

  private static final TelemetryServer instance = new TelemetryServer();

	public static TelemetryServer getInstance() {
		return instance;
	}

  private TelemetryServer() {

  }

  /**
	 *
	 * @param addr
	 *            Address to send message to
	 * @param message
	 *            Contents of UDP packets
	 * @param port
	 *            Port to send message over
	 */
	public void send(String message) {
		if (!senders.containsKey(port)) {
			try {
				senders.put(port, new DatagramSocket(port));
			} catch (SocketException e) {
				e.printStackTrace();
			}
		}
		DatagramPacket msg = null;
		try {
			msg = new DatagramPacket(message.getBytes(), message.getBytes().length, InetAddress.getByName(addr), port);
			senders.get(port).send(msg);
		} catch (UnknownHostException e1) {
			e1.printStackTrace();
			System.out.println("Host:" + addr + " not found!");
		} catch (IOException e) {
			e.printStackTrace();
		}
}
