import { Controller, Get, Post, Body, Param, Delete, Query, HttpException, HttpStatus } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { CreateMetricsDto } from "./dto/create-metrics.dto";
import { Metrics } from "./entities/metrics.entity";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  async createMetrics(@Body() createMetricsDto: CreateMetricsDto): Promise<Metrics> {
    try {
      const metric = await this.metricsService.createMetrics(createMetricsDto);
      return metric;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    return await this.metricsService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return await this.metricsService.findById(id);
  }

  @Get("device/:deviceId")
  async findAllByDeviceId(@Param("deviceId") deviceId: string) {
    const metrics = await this.metricsService.findAllByDeviceId(deviceId);
    return metrics;
  }

  @Delete("old")
  async deleteOldMetrics() {
    await this.metricsService.deleteOldMetrics();
  }

  @Delete("all")
  async deletedAllMetric() {
    await this.metricsService.deleteAll();
  }
}
