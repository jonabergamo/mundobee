import { Injectable, OnModuleInit } from "@nestjs/common";
import * as mqtt from "mqtt";
import { AppGateway } from "../app.gateway";
import { LogService } from "src/logger/log.service";
import { log } from "console";

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient;

  constructor(
    private gateway: AppGateway,
    private logger: LogService,
  ) {}

  onModuleInit() {
    this.client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`);
    this.logger.config(MqttService.name);

    this.client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      this.client.subscribe("device/+", err => {
        if (!err) {
          console.log("Subscribed to topic");
        }
      });
    });

    this.client.on("message", (topic, message) => {
      // this.logger.debug(`Received message: ${message.toString()} from topic: ${topic}`);
      this.gateway.broadcastMessage(topic, message.toString());
    });
  }

  sendMessage(topic: string, message: string) {
    this.client.publish(topic, message);
  }
}
