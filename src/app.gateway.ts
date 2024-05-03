import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*", // Ajuste isso conforme sua política de CORS
    methods: ["GET", "POST"],
    credentials: true
  }
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: {topic:string}): void {
      console.log("Received data:", data); // Confirma que os dados estão corretos
      console.log(`Subscribing client ${client.id} to topic ${data.topic}`);
      client.join('device/teste');
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { topic: string }) {
    console.log(`Unsubscribing ${client.id} from topic ${data.topic}`);
    client.leave(data.topic);
  }

  broadcastMessage(topic: string, message: string) {
    this.server.to(topic).emit(topic, message);
}
}
