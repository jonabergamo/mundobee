import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";
import { Device } from "./entities/device.entity";

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async createDevice(data: CreateDeviceDto): Promise<Device> {
    const device = this.deviceRepository.create(data);
    return this.deviceRepository.save(device);
  }

  async toggleDeviceState(id: string, isOn: boolean): Promise<Device> {
    await this.deviceRepository.update(id, { isOn });
    return this.deviceRepository.findOne({ where: { id: id } });
  }

  async findAllDevices(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async findDeviceById(id: string): Promise<Device> {
    return this.deviceRepository.findOne({ where: { id: id } });
  }

  async updateDevice(id: string, data: UpdateDeviceDto): Promise<Device> {
    await this.deviceRepository.update(id, data);
    return this.deviceRepository.findOne({ where: { id: id } });
  }

  async deleteDevice(id: string): Promise<void> {
    await this.deviceRepository.delete(id);
  }
}

