import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus, HttpCode } from '@nestjs/common';
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
  async getAllPresets() {
    return await this.presetService.findAllPresets();
  }

  @Get(":id")
  async getPresetById(@Param("id") id: string) {
    return await this.presetService.findPresetById(id);
  }

  @Put(":id")
  async updatePreset(@Param("id") id: string, @Body() updatePresetDto: UpdatePresetDto) {
    try {
      return await this.presetService.updatePreset(id, updatePresetDto);
    } catch (error) {
      return { success: false, error: "Error updating preset", details: error.message };
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deletePreset(@Param("id") id: string) {
    try {
      await this.presetService.deletePreset(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Preset configuration to delete does not exist." };
    }
  }
}
