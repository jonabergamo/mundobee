import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async createDevice(data: CreateDeviceDto) {
    return this.prisma.device.create({
      data,
    });
  }

  async toggleDeviceState(id: string, isOn: boolean) {
    return this.prisma.device.update({
      where: { id },
      data: { isOn },
    });
  }

  async findAllDevices() {
    return this.prisma.device.findMany();
  }

  async findDeviceById(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }

  async updateDevice(id: string, data: UpdateDeviceDto) {
    return this.prisma.device.update({
      where: { id },
      data,
    });
  }

  async deleteDevice(id: string) {
    return this.prisma.device.delete({
      where: { id },
    });
  }
}
