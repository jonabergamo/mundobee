import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, LessThan, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { Metrics } from "./entities/metrics.entity";
import { CreateMetricsDto } from "./dto/create-metrics.dto";
import { Device } from "src/device/entities/device.entity";
import { LogService } from "src/logger/log.service";
import moment from "moment-timezone";

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
    this.logger.debug("Serviço de criação de metricas acionado.");
    const { deviceId, timestamp, ...restData } = createMetricsDto;

    // Find the device by id
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });

    // Return a meaningful response if the device is not found
    if (!device?.id) {
      this.logger.error("Device not found");
      throw new HttpException("Device not found", HttpStatus.NOT_FOUND);
    }

    let convertedTimestamp: Date;

    if (timestamp) {
      // Use the provided timestamp if it exists
      convertedTimestamp = new Date(timestamp);
    } else {
      // Otherwise, use the current timestamp with timezone
      const currentTimestamp = moment().tz("America/Sao_Paulo");
      convertedTimestamp = new Date(currentTimestamp.format("YYYY-MM-DDTHH:mm:ss.000") + "Z");
    }

    // Create a new metric entity
    const metric = this.metricsRepository.create({
      device,
      timestamp: convertedTimestamp, // Set timestamp appropriately
      ...restData,
    });

    // Save the metric to the database
    return await this.metricsRepository.save(metric);
  }

  async findAll(): Promise<Metrics[]> {
    return this.metricsRepository.find({ relations: ["device"], order: { timestamp: "DESC" } });
  }

  async findAllByDeviceId(deviceId: string, from?: Date, to?: Date): Promise<any> {
    let whereClause: any = { device: { id: deviceId } };

    if (from && to) {
      console.log(`Filtering metrics between ${from} and ${to}`);
      whereClause.timestamp = Between(from, to);
    } else if (from) {
      console.log(`Filtering metrics from ${from}`);
      whereClause.timestamp = MoreThanOrEqual(from);
    } else if (to) {
      console.log(`Filtering metrics until ${to}`);
      whereClause.timestamp = LessThanOrEqual(to);
    }

    console.log("Where Clause:", whereClause);

    const metrics = await this.metricsRepository.find({
      where: whereClause,
      order: {
        timestamp: "ASC",
      },
      relations: ["device"],
    });

    console.log("Fetched Metrics:", metrics);

    let inCount = 0;
    let outCount = 0;

    for (const metric of metrics) {
      inCount += metric.inCount;
      outCount += metric.outCount;
    }

    return {
      metrics,
      inCount,
      outCount,
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
