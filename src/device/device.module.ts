import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceController } from "./device.controller";
import { PrismaService } from "src/prisma/prisma.service"; // Importe o PrismaService se já não estiver global

@Module({
  controllers: [DeviceController],
  providers: [DeviceService, PrismaService],
  exports: [DeviceService],
})
export class DeviceModule {}
