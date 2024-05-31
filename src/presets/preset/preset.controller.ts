import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresetService } from './preset.service';
import { CreatePresetDto } from './dto/create-preset.dto';
import { UpdatePresetDto } from './dto/update-preset.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("presets")
@Controller('presets')
export class PresetController {
  constructor(private readonly presetService: PresetService) {}

  @Post()
  async create(@Body() createPresetDto: CreatePresetDto) {
    return await this.presetService.createPreset(createPresetDto);
  }

  @Get()
  async getAllDevices() {
    return await this.presetService.findAllPresets();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresetDto: UpdatePresetDto) {
    return this.presetService.update(+id, updatePresetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presetService.remove(+id);
  }
}
