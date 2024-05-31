import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, LessThan, Repository } from "typeorm";
import { Metrics } from "./entities/metrics.entity";
import { CreateMetricsDto } from "./dto/create-metrics.dto";
import { Device } from "src/device/entities/device.entity";
import { LogService } from "src/logger/log.service";

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metrics)
    private metricsRepository: Repository<Metrics>,
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private logger: LogService,
  ) {}

  async createMetrics(createMetricsDto: CreateMetricsDto): Promise<Metrics> {
    this.logger.config(MetricsService.name);
    const { deviceId, ...restData } = createMetricsDto;

    // Find the device by id
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });

    // Throw NotFoundException if device is not found
    if (!device || !device.id) {
      this.logger.error("Device not found");
      throw new NotFoundException("Device not found");
    }

    // Create a new metric entity
    const metric = this.metricsRepository.create({
      ...restData,
      device: device, // or simply device, TypeScript will infer
    });

    // Save the metric to the database
    return await this.metricsRepository.save(metric);
  }

  async findAll(): Promise<Metrics[]> {
    return this.metricsRepository.find({ relations: ["device"], order: { timestamp: "DESC" } });
  }

  async findAllByDeviceId(deviceId: string, interval: string): Promise<Metrics[]> {
    let intervalMilliseconds: number;

    switch (interval) {
      case "minute":
        intervalMilliseconds = 60 * 1000; // 1 minute
        break;
      case "fiveMinutes":
        intervalMilliseconds = 5 * 60 * 1000; // 5 minutes
        break;
      case "hour":
        intervalMilliseconds = 60 * 60 * 1000; // 1 hour
        break;
      default:
        intervalMilliseconds = 60 * 1000; // default to 1 minute
        break;
    }

    const metrics = await this.metricsRepository.find({
      where: {
        device: { id: deviceId },
      },
      order: {
        timestamp: "ASC",
      },
      relations: ["device"],
    });

    const filteredMetrics: Metrics[] = [];

    if (metrics.length > 0) {
      let lastTimestamp = metrics[0].timestamp.getTime();
      filteredMetrics.push(metrics[0]);

      for (let i = 1; i < metrics.length; i++) {
        const currentTimestamp = metrics[i].timestamp.getTime();

        if (currentTimestamp - lastTimestamp >= intervalMilliseconds) {
          // 1 minute
          filteredMetrics.push(metrics[i]);
          lastTimestamp = currentTimestamp;
        }
      }
    }

    return filteredMetrics;
  }

  async findById(id: string): Promise<Metrics> {
    return this.metricsRepository.findOne({ where: { id } });
  }

  async deleteOldMetrics(): Promise<void> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    await this.metricsRepository.delete({ timestamp: LessThan(oneMonthAgo) });
  }

  async deleteAll() {
    await this.metricsRepository.delete({});
  }
}
