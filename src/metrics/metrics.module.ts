import { MetricsController } from "./metrics.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metrics } from "./entities/metrics.entity";
import { MetricsService } from "./metrics.service";

import { Module } from "@nestjs/common";
import { Device } from "src/device/entities/device.entity";
import { DeviceService } from "src/device/device.service";
import { User } from "src/auth/enitities/user.entity";
import { LogModule } from "src/logger/log.module";

@Module({
  imports: [TypeOrmModule.forFeature([Metrics, Device, User]), LogModule],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
