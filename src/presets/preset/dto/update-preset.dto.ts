import { PartialType } from '@nestjs/mapped-types';
import { CreatePresetDto } from './create-preset.dto';

export class UpdatePresetDto extends PartialType(CreatePresetDto) {}
