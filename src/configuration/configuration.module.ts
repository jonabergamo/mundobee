import { ConfigurationController } from "./configuration.controller";
import { ConfigurationService } from "./configuration.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
