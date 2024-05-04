import { Module } from "@nestjs/common";
import { MqttService } from "./mqtt/mqtt.service";
import { AppGateway } from "./app.gateway";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./auth/common/guards";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { DeviceModule } from "./device/device.module";

@Module({
  imports: [
    DeviceModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    AppGateway,
    MqttService,
  ],
})
export class AppModule {}
