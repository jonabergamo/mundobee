import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, UseInterceptors } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "./user.service";
import { ApiTags, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { User } from "src/auth/enitities/user.entity";
import { UserResponseDto } from "./dto/userResponse.dto";
import { GetCurrentUserId } from "src/auth/common/decorators";

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
  ) {}

  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    return await this.userService.findAll();
  }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<UserResponseDto> {
    return await this.userService.findUserById(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: Partial<User>): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(id, updateUserDto);

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<void> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    await this.userService.deleteUser(id);
  }
}
