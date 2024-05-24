import { ConfigurationModule } from "./configuration/configuration.module";
import { UserModule } from "./user/user.module";
import { Module } from "@nestjs/common";
import { MqttService } from "./mqtt/mqtt.service";
import { AppGateway } from "./app.gateway";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./auth/common/guards";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { DeviceModule } from "./device/device.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";

@Module({
  imports: [
    ConfigurationModule,
    UserModule,
    DeviceModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
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

