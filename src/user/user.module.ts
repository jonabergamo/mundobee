import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { UserController } from "./user.controller";

import { Module } from "@nestjs/common";

import { LogModule } from "src/logger/log.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/enitities/user.entity";

@Module({
  imports: [LogModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
