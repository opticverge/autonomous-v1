import json
import os
import random
import argparse
import time
from xmlrpc.client import DateTime

import paho.mqtt.client as mqtt
from datetime import datetime, timezone

from paho.mqtt.packettypes import PacketTypes
from paho.mqtt.properties import Properties


def generate_telemetry_data(vehicle_id="VEH-001"):
    """Generate simulated vehicle telemetry data"""
    data = {
        "vehicleId": vehicle_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "location": {
            "type": "Point",
            "coordinates": [-122.4194 + random.uniform(-0.01, 0.01), 37.7749 + random.uniform(-0.01, 0.01)]
        },
        #         "speed": random.uniform(0, 120),  # km/h
        #         "heading": random.uniform(0, 359),  # degrees
        #         "engineData": {
        #             "rpm": random.uniform(800, 3500),
        #             "temperature": random.uniform(80, 105),
        #             "fuelLevel": random.uniform(0, 100),
        #         },
        #         "batteryVoltage": 12 + random.uniform(-0.5, 0.5),
        #         "tireData": {
        #             "frontLeft": random.uniform(30, 36),
        #             "frontRight": random.uniform(30, 36),
        #             "rearLeft": random.uniform(30, 36),
        #             "rearRight": random.uniform(30, 36),
        #         },
    }
    return data


def on_connect(client, userdata, flags, rc, properties=None):
    """Callback when client connects to the broker"""
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        # Provide more detailed error messages based on return code
        error_messages = {
            1: "Connection refused - incorrect protocol version",
            2: "Connection refused - invalid client identifier",
            3: "Connection refused - server unavailable",
            4: "Connection refused - bad username or password",
            5: "Connection refused - not authorized"
        }
        error_message = error_messages.get(rc, f"Unknown error code {rc}")
        print(f"Failed to connect, return code {rc}: {error_message}")

        # For debugging - print all available flags
        print(f"Connection flags: {flags}")
        if properties:
            print(f"Connection properties: {properties}")


def on_publish(client, userdata, mid, properties=None):
    """Callback when message is published"""
    print(f"Message ID: {mid} published")


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Send vehicle telemetry data over MQTT')
    parser.add_argument('--broker', default='emqx', help='MQTT broker address')
    parser.add_argument('--port', type=int, default=1883, help='MQTT broker port')
    parser.add_argument('--topic', default='vehicle/telemetry', help='MQTT topic')
    parser.add_argument('--vehicle', default=os.getenv('VEHICLE_ID'), help='Vehicle ID')
    parser.add_argument('--qos', type=int, default=1, choices=[0, 1, 2], help='MQTT QoS level')
    parser.add_argument('--username', help='MQTT broker username', default='autonomous')
    parser.add_argument('--password', help='MQTT broker password', default='autonomous')
    parser.add_argument('--apikey', help='api key for the request', default='')
    parser.add_argument('--status', help='the vehicle status', default='')

    args = parser.parse_args()

    try:
        client_id = f"client_{args.vehicle}"
        client = mqtt.Client(client_id=client_id, protocol=mqtt.MQTTv5)

        client.on_connect = on_connect
        client.on_publish = on_publish

        client.username_pw_set(args.username, args.password)

        print(f"Using client ID: {client_id} with username: {args.username}")

        try:
            connect_result = client.connect(args.broker, args.port, keepalive=60)

            if connect_result != mqtt.MQTT_ERR_SUCCESS:
                print(f"Initial connection failed with code: {connect_result}")

            client.loop_start()

            if not client.is_connected():
                print("Warning: Client does not appear to be connected after initial connection attempt")
        except Exception as e:
            print(f"Connection failed: {e}")
            return

        # Generate and send telemetry
        try:
            telemetry = generate_telemetry_data(args.vehicle, arg.status)
            payload = json.dumps(telemetry)

            print(f"Sending telemetry data to {args.topic}...")
            print(f"Data: {payload}")

            properties = Properties(PacketTypes.PUBLISH)

            properties.UserProperty = [("apiKey", args.apikey)]

            result = client.publish(args.topic, payload, qos=args.qos)

            # Wait for the message to be published
            result.wait_for_publish()

            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print("Telemetry data sent successfully!")
            else:
                print(f"Failed to send data: {result.rc}")

        except Exception as e:
            print(f"Error sending telemetry: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker")


if __name__ == "__main__":
    main()
