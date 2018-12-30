// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2018 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;

/**
* Handles rx/tx of telemetry data on robot side
*/
public class TelemetryServer {

  private static final TelemetryServer instance = new TelemetryServer(5801);

	public static TelemetryServer getInstance() {
		return instance;
	}

  private DatagramSocket socket;

  private TelemetryServer(int port) {
    try {
      socket = new DatagramSocket(port);
    } catch (SocketException e) {
      e.printStackTrace();
    }
  }

  /**
	 *
	 * @param dataPoint
	 *            Data point to send
	 */
	public <T> void send(TelemetryDataPoint<T> dataPoint) {
		try {
      ByteBuffer sendBuffer;
      long timestamp = System.currentTimeMillis();
      if (dataPoint.value instanceof String) {
        String value = (String)(Object)dataPoint.value;
        sendBuffer = ByteBuffer.allocate(8 + 2 + value.length() + 1);
        sendBuffer.putLong(timestamp);
        sendBuffer.put(dataPoint.key.getBytes());
        sendBuffer.put(value.getBytes());
      } else {
        String value = String.valueOf(dataPoint.value);
        sendBuffer = ByteBuffer.allocate(8 + 2 + 8 + 1);
        sendBuffer.putLong(timestamp);
        sendBuffer.put(dataPoint.key.getBytes());
        sendBuffer.put(value.getBytes());
      }

			DatagramPacket msg = new DatagramPacket(sendBuffer.array(), sendBuffer.position(), InetAddress.getByName("127.0.0.1"), 5800);
			socket.send(msg);
		} catch (IOException e) {
			e.printStackTrace();
		}
  }
}
