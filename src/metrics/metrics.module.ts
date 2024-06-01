import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metrics } from './entities/metrics.entity';
import { MetricsService } from './metrics.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsController, MyCustomController } from './metrics.controller';
import { Device } from 'src/device/entities/device.entity';
import { DeviceService } from 'src/device/device.service';
import { User } from 'src/auth/enitities/user.entity';
import { LogModule } from 'src/logger/log.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Metrics, Device, User]),
    LogModule,
    PrometheusModule,
  ],
  controllers: [MetricsController, MyCustomController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule implements OnModuleInit {
  onModuleInit() {
    console.log('MetricsModule initialized');
  }
}