import { Module } from '@nestjs/common';
import { PresetService } from './preset.service';
import { PresetController } from './preset.controller';
import { Preset } from './entities/preset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "src/auth/enitities/user.entity";
import { LogModule } from 'src/logger/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Preset]), LogModule],
  controllers: [PresetController],
  providers: [PresetService],
  exports: [PresetService],
})
export class PresetModule {}
