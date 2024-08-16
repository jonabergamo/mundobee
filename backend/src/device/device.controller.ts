import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { CreateDeviceDto, UpdateDeviceDto } from "./dto";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { GetCurrentUser, GetCurrentUserId } from "src/auth/common/decorators";

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

  @Post(":id/owner")
  async addOwner(@Param("id") deviceId: string, @GetCurrentUserId() userId: string) {
    return this.deviceService.addOwner(deviceId, userId);
  }

  @Post(":id/change-owner")
  async changeOwner(@Param("id") deviceId: string, @Body("newOwnerEmail") newOwnerEmail: string, @Body("ownerId") userId: string) {
    return this.deviceService.changeOwner(deviceId, userId, newOwnerEmail);
  }

  @Post(":id/viewers")
  async addViewer(@Param("id") deviceId: string, @Body("viewerEmail") viewerEmail: string, @Body("ownerId") userId: string) {
    return this.deviceService.addViewer(deviceId, viewerEmail, userId);
  }

  @Post(":id/viewers/remove")
  async removeViewer(@Param("id") deviceId: string, @Body("viewerEmail") viewerEmail: string, @Body("ownerId") userId: string) {
    return this.deviceService.removeViewer(deviceId, viewerEmail, userId);
  }

  @Get("user/:userId")
  async findDevicesByUser(@Param("userId") userId: string) {
    return await this.deviceService.findDevicesByUser(userId);
  }
}
