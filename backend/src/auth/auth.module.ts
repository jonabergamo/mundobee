import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AtStrategy, RtStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
import { LogService } from "src/logger/log.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./enitities/user.entity";

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [AuthService, AtStrategy, RtStrategy, LogService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

