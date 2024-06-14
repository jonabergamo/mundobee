import { MetricsService } from "src/metrics/metrics.service";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { LogService } from "src/logger/log.service";

@Injectable()
export class SchedulerService {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly logger: LogService,
  ) {}

  @Cron("0 0 1 * *")
  async handleCron() {
    this.logger.config(SchedulerService.name);
    this.logger.debug("Serviço de expurgo iniciado");
    try {
      await this.metricsService.deleteOldMetrics();
      this.logger.debug("Métricas antigas deletadas com sucesso!");
    } catch (error) {
      this.logger.error("Erro ao deletar metricas antigas:", error);
    }
  }
}

