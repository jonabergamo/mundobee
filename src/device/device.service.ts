import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";
import { Device } from "./entities/device.entity";
import { User } from "src/auth/enitities/user.entity";
import { LogService } from "src/logger/log.service";

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private logger: LogService,
  ) {}

  async createDevice(data: CreateDeviceDto): Promise<Device> {
    const device = this.deviceRepository.create(data);
    return this.deviceRepository.save(device);
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

  async addOwner(deviceId: string, userId: string): Promise<Device> {
    this.logger.config(DeviceService.name);
    this.logger.debug(`Serviço de addOwner acionado`);
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });

    if (!device) {
      throw new NotFoundException("Device not found");
    }
    if (device.owner) {
      throw new ForbiddenException("Device already have a owner!");
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    device.owner = user;
    return this.deviceRepository.save(device);
  }

  async changeOwner(deviceId: string, currentUserId: string, newOwnerEmail: string): Promise<Device> {
    this.logger.config(DeviceService.name);
    this.logger.debug(`Serviço de changeOwner acionado`);
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new NotFoundException("Device not found");
    }
    if (device.owner && device.owner.id !== currentUserId) {
      throw new ForbiddenException("You are not the owner of this device");
    }
    const newOwner = await this.userRepository.findOne({ where: { email: newOwnerEmail } });
    if (!newOwner) {
      throw new NotFoundException("New owner not found");
    }
    device.owner = newOwner;
    return this.deviceRepository.save(device);
  }

  async addViewer(deviceId: string, viewerEmail: string, currentUserId: string): Promise<Device> {
    this.logger.config(DeviceService.name);
    this.logger.debug(`Serviço de addViewer acionado`);
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      this.logger.error("Device not found");
      throw new NotFoundException("Device not found");
    }
    if (device.owner && device.owner.id !== currentUserId) {
      this.logger.error("Only the owner can add viewers");
      throw new ForbiddenException("Only the owner can add viewers");
    }
    const viewer = await this.userRepository.findOne({ where: { email: viewerEmail } });
    if (!viewer) {
      this.logger.error("Viewer not found");
      throw new NotFoundException("Viewer not found");
    }
    if (!device.viewers) {
      device.viewers = [];
    }
    device.viewers.push(viewer);
    return this.deviceRepository.save(device);
  }

  async removeViewer(deviceId: string, viewerEmail: string, currentUserId: string): Promise<Device> {
    this.logger.config(DeviceService.name);
    this.logger.debug(`Serviço de removeViewer acionado`);
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new NotFoundException("Device not found");
    }
    const viewer = await this.userRepository.findOne({ where: { email: viewerEmail } });
    if (!viewer) {
      throw new NotFoundException("Viewer not found");
    }
    if (viewer.id !== currentUserId) {
      throw new ForbiddenException("You can only remove yourself as a viewer");
    }
    device.viewers = device.viewers.filter(v => v.id !== viewer.id);
    return this.deviceRepository.save(device);
  }

  async findDevicesByUser(userId: string) {
    this.logger.config(DeviceService.name);
    this.logger.debug(`Serviço de findDevicesByUser acionado`);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const ownedDevices = await this.deviceRepository.find({ where: { owner: user } });
    const viewedDevices = await this.deviceRepository.createQueryBuilder("device").leftJoin("device.viewers", "viewer").where("viewer.id = :userId", { userId }).getMany();

    return { owned: [...ownedDevices], viewer: [...viewedDevices] };
  }
}
