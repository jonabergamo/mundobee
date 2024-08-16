import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { UserController } from "./user.controller";

import { Module } from "@nestjs/common";

import { LogModule } from "src/logger/log.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/enitities/user.entity";
import { Device } from "src/device/entities/device.entity";
import { DeviceService } from "src/device/device.service";

@Module({
  imports: [LogModule, TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Device])],
  controllers: [UserController],
  providers: [UserService, DeviceService],
})
export class UserModule {}
