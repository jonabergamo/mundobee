/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Logger } from "@nestjs/common";

interface ILogger {
  serviceName?: string;
}
@Injectable()
export class LogService {
  public logger: ILogger = {};

  async config(serviceName: string) {
    this.logger.serviceName = serviceName;
  }

  log(data: object) {
    const logger = new Logger(this.logger.serviceName);
    logger.log(data);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, data?: object) {
    const logger = new Logger(this.logger.serviceName);
    logger.error(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any) {
    const logger = new Logger(this.logger.serviceName);
    logger.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  async debug(message: string) {
    const logger = new Logger(this.logger.serviceName);
    logger.debug(message);
  }
}
