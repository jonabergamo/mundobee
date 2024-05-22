import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DeviceService } from "./device/device.service";

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private deviceService: DeviceService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("subscribe")
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: string): void {
    const parsedData = JSON.parse(data);
    console.log(`Subscribing client ${client.id} to topic ${parsedData.topic}`);
    client.join(parsedData.topic);
  }

  @SubscribeMessage("unsubscribe")
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const parsedData = JSON.parse(data);
    console.log(`Unsubscribing ${client.id} from topic ${parsedData.topic}`);
    client.leave(parsedData.topic);
  }

  @SubscribeMessage("toggleDevice")
  async handleToggleDevice(@ConnectedSocket() client: Socket, @MessageBody() data: string): Promise<void> {
    try {
      const { deviceId, isOn } = JSON.parse(data);
      const updatedDevice = await this.deviceService.toggleDeviceState(deviceId, isOn);
      this.server.to(deviceId).emit("deviceUpdated", JSON.stringify(updatedDevice));
      console.log(`Device ${deviceId} state updated to ${isOn}`);

      // Publicar o estado atualizado no tópico MQTT
      this.broadcastMessage(`device/${deviceId}`, JSON.stringify(updatedDevice));
    } catch (error) {
      console.error(`Error toggling device state: ${error.message}`);
      client.emit("error", "Failed to toggle device state");
    }
  }

  broadcastMessage(topic: string, message: string) {
    this.server.to(topic).emit(topic, message);
  }
}
