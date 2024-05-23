import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AtStrategy, RtStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
import { LogService } from "src/logger/log.service";

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy, LogService],
  controllers: [AuthController],
})
export class AuthModule {}

