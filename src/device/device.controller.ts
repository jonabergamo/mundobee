import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("devices")
@Controller("devices")
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Post()
  async createDevice(@Body() createDeviceDto: CreateDeviceDto) {
    return await this.deviceService.createDevice(createDeviceDto);
  }

  @Get()
  async getAllDevices() {
    return await this.deviceService.findAllDevices();
  }

  @Get(":id")
  async getDeviceById(@Param("id") id: string) {
    return await this.deviceService.findDeviceById(id);
  }

  @Put(":id")
  async updateDevice(@Param("id") id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return await this.deviceService.updateDevice(id, updateDeviceDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteDevice(@Param("id") id: string) {
    try {
      await this.deviceService.deleteDevice(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Record to delete does not exist." };
    }
  }
}

