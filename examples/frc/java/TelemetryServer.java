// robodashboard - Node.js web dashboard for displaying data from and controlling teleoperated robots
// Copyright 2019 jackw01. Released under the MIT License (see LICENSE for details).
// robodashboard FRC interface v0.1.0

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

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
	 * @param message
	 * 		Message to log and send to dashboard
	 */
	public void log(String message) {
		sendString("log ", message);
	}

	/**
	 *
	 * @param dataPoint
	 * 		Data point to send
	 */
	public void sendData(String k, double... v) {
		double[] values = v;
		ByteBuffer sendBuffer;
		long timestamp = System.currentTimeMillis();
		sendBuffer = ByteBuffer.allocate(6 + 4 + 8 * values.length).order(ByteOrder.LITTLE_ENDIAN);
		sendBuffer.putLong(timestamp).position(6);
		sendBuffer.put(k.getBytes());
		for (double value : values) {
			sendBuffer.putDouble(value);
		}
		sendRawData(sendBuffer);
	}

	/**
	 *
	 * @param stringValue
	 * 		String to send
	 */
	public void sendString(String k, String v) {
		ByteBuffer sendBuffer;
		long timestamp = System.currentTimeMillis();
		sendBuffer = ByteBuffer.allocate(6 + 4 + v.length() + 1).order(ByteOrder.LITTLE_ENDIAN);
		sendBuffer.putLong(timestamp).position(6);
		sendBuffer.put(k.getBytes());
		sendBuffer.put(v.getBytes());
		sendRawData(sendBuffer);
	}

	/**
	 *
	 * @param sendBuffer
	 * 		Buffer to send
	 */
	private void sendRawData(ByteBuffer sendBuffer) {
		// bytes 0-5: timestamp
		// bytes 6-9: key string
		// bytes 10+: value
		try {
			DatagramPacket msg = new DatagramPacket(sendBuffer.array(), sendBuffer.position(),
				InetAddress.getByName("127.0.0.1"), 5800);
			socket.send(msg);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
