import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { DeviceService } from "./device/device.service";
import { LogService } from "./logger/log.service";
import { MetricsService } from "./metrics/metrics.service";

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private deviceService: DeviceService,
    private logger: LogService,
    private metricsService: MetricsService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    this.logger.config(AppGateway.name);
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.config(AppGateway.name);
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("subscribe")
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: string): void {
    this.logger.config(AppGateway.name);
    const parsedData = JSON.parse(data);
    this.logger.debug(`Subscribing client ${client.id} to topic ${parsedData.topic}`);
    client.join(parsedData.topic);
  }

  @SubscribeMessage("unsubscribe")
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const parsedData = JSON.parse(data);
    console.log(`Unsubscribing ${client.id} from topic ${parsedData.topic}`);
    client.leave(parsedData.topic);
  }

  async broadcastMessage(topic: string, message: string) {
    this.logger.config(AppGateway.name);
    this.server.to(topic).emit(topic, message);
    const deviceId = topic.split("/")[1]; // Extrai o ID do dispositivo do tópico

    // Register the metrics in the database
    const data = JSON.parse(message);
    // this.logger.debug(`Registering metrics: ${JSON.stringify(data)}`);
    await this.metricsService.createMetrics({ deviceId, ...data });
  }
}
