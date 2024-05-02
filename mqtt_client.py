import time
import random
import json
import logging as log
import paho.mqtt.client as mqtt
import os

log.info("Publisher is started...")
broker_host = os.environ.get('MQTT_BROKER_HOST')
topic = os.environ.get('MQTT_TOPIC')

broker_port = 1883
device_id = "IND_DEV_001"
topic = topic+"/"+ device_id

client = mqtt.Client()
client.connect(broker_host, broker_port)
interval = 1

def generate_device_data():
     # Simulate generating new device data
        new_temperature = random.uniform(20.0, 30.0)
        new_humidity = random.uniform(40, 70)
        new_pressure = random.uniform(1.0, 5.0)  # Pressure in bars
        new_voltage = random.uniform(200, 240)  # Voltage in volts

        # Update the device data with the new values
        device_data = {
            "device_id": "IND_DEV_001",
            "temperature": new_temperature,
            "humidity": new_humidity,
            "pressure": new_pressure,
            "voltage": new_voltage,
            "status": "operational",
        }

        # Convert the updated device data to JSON
        json_data = json.dumps(device_data)
        return json_data

def simulate_device():
    while True:

        value = random.randint(1, 100)
        # client.publish(topic, str(value))
        client.publish(topic, generate_device_data())
        log.info(f"Published: {value}")
        time.sleep(interval)

if __name__:
    simulate_device()