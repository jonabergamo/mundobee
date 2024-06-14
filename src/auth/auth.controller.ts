import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, SignupDto } from "./dto";
import { Tokens } from "./types";
import { AtGuard, RtGuard } from "./common/guards";
import { GetCurrentUser, GetCurrentUserId, Public } from "./common/decorators";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("local/signup")
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post("local/signin")
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(RtGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @ApiHeader({
    name: "Authorization",
    description: "Refresh token with 'Bearer'",
  })
  @Public()
  @UseGuards(RtGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUserId() userId: string, @GetCurrentUser("refreshToken") refreshToken: string) {
    console.log(refreshToken, userId);
    return this.authService.refreshTokens(userId, refreshToken);
  }
}

