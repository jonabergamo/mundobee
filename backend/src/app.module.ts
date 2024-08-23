import { MetricsModule } from "./metrics/metrics.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { UserModule } from "./user/user.module";
import { Module } from "@nestjs/common";
import { MqttService } from "./mqtt/mqtt.service";
import { AppGateway } from "./app.gateway";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AtGuard } from "./auth/common/guards";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DeviceModule } from "./device/device.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { LogModule } from "./logger/log.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SchedulerService } from "./schedules/scheduler";
import { PresetModule } from "./presets/preset.module";
import { LoggingInterceptor } from "./logging.interceptor";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [
    PrometheusModule.register({ path: "/api/prometrics" }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MetricsModule,
    MqttModule,
    UserModule,
    DeviceModule,
    AuthModule,
    PresetModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    LogModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    AppGateway,
    MqttService,
  ],
})
export class AppModule {}
