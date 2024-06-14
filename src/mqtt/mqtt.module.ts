/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { LogModule } from "src/logger/log.module";
import { LogService } from "src/logger/log.service";

@Module({
  imports: [LogModule],
  controllers: [],
  providers: [LogService],
})
export class MqttModule {}
