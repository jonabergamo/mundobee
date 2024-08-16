import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LogService } from "./log.service";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
