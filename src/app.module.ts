import { Module } from '@nestjs/common';
import { MqttService } from './mqtt/mqtt.service';
import { AppGateway } from './app.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AppGateway, MqttService],
})
export class AppModule {}
