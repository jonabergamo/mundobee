import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { AppGateway } from '../app.gateway';

@Injectable()
export class MqttService implements OnModuleInit {
  private client = null;

  constructor(private gateway: AppGateway) {}

  onModuleInit() {
    this.client = mqtt.connect('mqtt://mosquitto:1883');

    this.client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      this.client.subscribe('device/+', (err) => {
        if (!err) {
          console.log('Subscribed to topic');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(
        `Received message: ${message.toString()} from topic: ${topic}`,
      );
      this.gateway.broadcastMessage(topic, message.toString());
    });
  }
}
