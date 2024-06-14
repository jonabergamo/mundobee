import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
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
    this.logger.debug("Serviço de criação de métricas acionado");
    const moment = require("moment-timezone");
    this.logger.config(MetricsService.name);
    const { deviceId, ...restData } = createMetricsDto;

    // Find the device by id
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });

    // Return a meaningful response if the device is not found
    if (!device?.id) {
      this.logger.error("Device not found");
      throw new HttpException("Device not found", HttpStatus.NOT_FOUND);
    }

    const timestamp = moment().tz("America/Sao_Paulo");
    const convertedTimestamp = new Date(timestamp.format("YYYY-MM-DDTHH:mm:ss.000") + "Z");

    // Create a new metric entity
    const metric = this.metricsRepository.create({
      device, // or simply device, TypeScript will infer
      timestamp: convertedTimestamp, // Set timestamp with timezone
      ...restData,
    });

    // Save the metric to the database
    return await this.metricsRepository.save(metric);
  }

  async findAll(): Promise<Metrics[]> {
    return this.metricsRepository.find({ relations: ["device"], order: { timestamp: "DESC" } });
  }

  async findAllByDeviceId(deviceId: string): Promise<any> {
    const metrics = await this.metricsRepository.find({
      where: {
        device: { id: deviceId },
      },
      order: {
        timestamp: "ASC",
      },
      relations: ["device"],
    });

    let dailyInCount = 0;
    let dailyOutCount = 0;
    let weeklyInCount = 0;
    let weeklyOutCount = 0;
    let monthlyInCount = 0;
    let monthlyOutCount = 0;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    for (const metric of metrics) {
      if (metric.timestamp > oneDayAgo) {
        dailyInCount += metric.inCount;
        dailyOutCount += metric.outCount;
      }
      if (metric.timestamp > oneWeekAgo) {
        weeklyInCount += metric.inCount;
        weeklyOutCount += metric.outCount;
      }
      if (metric.timestamp > oneMonthAgo) {
        monthlyInCount += metric.inCount;
        monthlyOutCount += metric.outCount;
      }
    }

    return {
      metrics,
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
