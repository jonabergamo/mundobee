import { Controller, Get, Post, Body, Param, Delete, Query } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { CreateMetricsDto } from "./dto/create-metrics.dto";

@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  async createMetrics(@Body() createMetricsDto: CreateMetricsDto) {
    return await this.metricsService.createMetrics(createMetricsDto);
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
  async findAllByDeviceId(@Param("deviceId") deviceId: string, @Query("interval") interval: string) {
    const metrics = await this.metricsService.findAllByDeviceId(deviceId, interval);
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
