import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceController } from "./device.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Device } from "./entities/device.entity";
import { User } from "src/auth/enitities/user.entity";
import { LogModule } from "src/logger/log.module";

@Module({
  imports: [TypeOrmModule.forFeature([Device]), TypeOrmModule.forFeature([User]), LogModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
