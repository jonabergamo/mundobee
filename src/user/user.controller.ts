import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "./user.service";
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.findAll();
  }


  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return await this.userService.findUserById(id);
  }
}
