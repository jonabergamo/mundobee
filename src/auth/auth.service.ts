import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { AuthDto, SignupDto } from "./dto";
import * as bcrypt from "bcrypt";
import { Tokens } from "./types";
import { JwtService } from "@nestjs/jwt";
import { LogService } from "src/logger/log.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private loggerService: LogService,
  ) {}

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    // this.loggerService.debug(`Serviço de criação de usuario acionado`);

    // const user = await this.prisma.user.findUnique({
    //   where: { email: dto.email },
    // });
    // if (user) {
    //   throw new HttpException("User already exists", 409);
    // }
    // const hash = await this.hashData(dto.password);
    // const uniqueId = new ObjectId().toHexString(); // Convert ObjectId to string

    // const newUser = await this.prisma.user.create({
    //   data: {
    //     id: uniqueId, // Incluindo o ID manualmente
    //     email: dto.email,
    //     fullName: dto.fullName,
    //     hash,
    //   },
    // });
    // const tokens = await this.getTokens(newUser.id, newUser.email);
    // await this.updateRtHash(newUser.id, tokens.refresh_token);
    // this.loggerService.debug(`Usuario ${newUser.email} adicionado e logado na aplicação`);
    // return tokens;
    return;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    // this.loggerService.debug(`Serviço de autenticação acionado`);

    // const user = await this.prisma.user.findUnique({
    //   where: { email: dto.email },
    // });

    // if (!user) throw new ForbiddenException("Access Denied");

    // const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    // if (!passwordMatches) throw new ForbiddenException("Access Denied");

    // const tokens = await this.getTokens(user.id, user.email);
    // await this.updateRtHash(user.id, tokens.refresh_token);
    // this.loggerService.debug(`Usuario ${user.email} logado na aplicação`);
    // return tokens;
    return;
  }

  async logout(userId: string) {
    return;
    // await this.prisma.user.updateMany({
    //   where: {
    //     id: userId,
    //     hashedRt: {
    //       not: null,
    //     },
    //   },
    //   data: {
    //     hashedRt: null,
    //   },
    // });
  }

  async refreshTokens(userId: string, rt: string) {
    // this.loggerService.debug(`Serviço de refresh token acionado`);
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
    // if (!user?.hashedRt) {
    //   this.loggerService.error(`${user.email || userId} não está logado`);
    //   throw new ForbiddenException("Access Denied");
    // }

    // const rtMatches = await bcrypt.compare(rt, user.hashedRt);

    // if (!rtMatches) {
    //   this.loggerService.error(`${user.email || userId} refresh token inválido`);
    //   throw new ForbiddenException("Access Denied");
    // }

    // const tokens = await this.getTokens(user.id, user.email);
    // await this.updateRtHash(user.id, tokens.refresh_token);
    // return tokens;
    return;
  }

  async updateRtHash(userId: string, rt: string) {
    // const hash = await this.hashData(rt);
    // await this.prisma.user.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     hashedRt: hash,
    //   },
    // });
    return;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    //   const [at, rt] = await Promise.all([
    //     this.jwtService.signAsync(
    //       {
    //         sub: userId,
    //         email,
    //       },
    //       {
    //         secret: process.env.JWT_AT_SECRET,
    //         expiresIn: 60 * 15, // 15 minutes
    //       },
    //     ),
    //     this.jwtService.signAsync(
    //       {
    //         sub: userId,
    //         email,
    //       },
    //       {
    //         secret: process.env.JWT_RT_SECRET,
    //         expiresIn: 60 * 60 * 24 * 7, // 1 week
    //       },
    //     ),
    //   ]);
    //   return {
    //     access_token: at,
    //     refresh_token: rt,
    //   };
    // }
    return;
  }
}

