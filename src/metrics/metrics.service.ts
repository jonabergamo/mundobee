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
    const moment = require("moment-timezone");
    this.logger.config(MetricsService.name);
    this.logger.debug("Serviço de criação de metricas acionado.");
    const { deviceId, ...restData } = createMetricsDto;

    // Find the device by id
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });

    // Throw NotFoundException if device is not found
    if (!device || !device.id) {
      this.logger.error("Device not found");
    }

    const timestamp = moment().tz("America/Sao_Paulo");
    const convertedTimestamp = new Date(timestamp.format("YYYY-MM-DDTHH:mm:ss.000") + "Z");

    // Create a new metric entity
    const metric = this.metricsRepository.create({
      device: device, // or simply device, TypeScript will infer
      timestamp: convertedTimestamp, // Set timestamp with timezone
      ...restData,
    });

    // Save the metric to the database
    return await this.metricsRepository.save(metric);
  }

  async findAll(): Promise<Metrics[]> {
    return this.metricsRepository.find({ relations: ["device"], order: { timestamp: "DESC" } });
  }

  async findAllByDeviceId(deviceId: string, interval: string): Promise<any> {
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
        intervalMilliseconds = 100; // default to 1 minute
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
    let dailyInCount = 0;
    let dailyOutCount = 0;
    let weeklyInCount = 0;
    let weeklyOutCount = 0;
    let monthlyInCount = 0;
    let monthlyOutCount = 0;

    if (metrics.length > 0) {
      let lastTimestamp = metrics[0].timestamp.getTime();
      filteredMetrics.push(metrics[0]);

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      for (let i = 1; i < metrics.length; i++) {
        const currentTimestamp = metrics[i].timestamp.getTime();

        if (currentTimestamp - lastTimestamp >= intervalMilliseconds) {
          filteredMetrics.push(metrics[i]);
          lastTimestamp = currentTimestamp;
        }

        if (metrics[i].timestamp > oneDayAgo) {
          dailyInCount += metrics[i].inCount;
          dailyOutCount += metrics[i].outCount;
        }
        if (metrics[i].timestamp > oneWeekAgo) {
          weeklyInCount += metrics[i].inCount;
          weeklyOutCount += metrics[i].outCount;
        }
        if (metrics[i].timestamp > oneMonthAgo) {
          monthlyInCount += metrics[i].inCount;
          monthlyOutCount += metrics[i].outCount;
        }
      }
    }

    return {
      metrics: filteredMetrics,
      dailyInCount,
      dailyOutCount,
      weeklyInCount,
      weeklyOutCount,
      monthlyInCount,
      monthlyOutCount,
    };
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

