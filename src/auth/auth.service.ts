import { ForbiddenException, HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthDto, SignupDto } from "./dto";
import * as bcrypt from "bcrypt";
import { Tokens } from "./types";
import { JwtService } from "@nestjs/jwt";
import { LogService } from "src/logger/log.service";
import { User } from "./enitities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private loggerService: LogService,
  ) {}

  async signupLocal(dto: SignupDto): Promise<Tokens> {
    this.loggerService.config(AuthService.name);
    this.loggerService.debug("Serviço de criação de usuário acionado");
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new HttpException("User already exists", 409);
    }

    const hash = await this.hashData(dto.password);

    const newUser = await this.userRepository.save({
      email: dto.email,
      fullName: dto.fullName,
      hash,
    });

    const tokens = await this.getTokens(newUser);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.userRepository.update(userId, { hashedRt: hash });
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    this.loggerService.config(AuthService.name);
    this.loggerService.debug("Serviço de login acionado");
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      this.loggerService.error("Access Denied");
      throw new ForbiddenException("Access Denied");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches) {
      this.loggerService.error("Password doesn't match");
      throw new ForbiddenException("Access Denied");
    }

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    this.loggerService.config(AuthService.name);
    this.loggerService.debug("Serviço de logout acionado");
    try {
      await this.userRepository.update(userId, { hashedRt: null });
    } catch (error) {
      this.loggerService.error("Não foi possivel deslogar");
    }
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    this.loggerService.config(AuthService.name);
    this.loggerService.debug("Serviço de refresh tokens acionado");

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user?.hashedRt) {
      this.loggerService.error("User is not in a session");
      throw new ForbiddenException("Access Denied");
    }

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);

    if (!rtMatches) {
      this.loggerService.error("Refresh tokens doesn't match");
      throw new ForbiddenException("Access Denied");
    }

    const tokens = await this.getTokens(user);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(user: User): Promise<Tokens> {
    const additionalPayload = {
      fullName: user.fullName,
    };

    const email = user.email;

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ sub: user.id, email, ...additionalPayload }, { secret: process.env.JWT_AT_SECRET, expiresIn: 60 * 15 }),
      this.jwtService.signAsync({ sub: user.id, email }, { secret: process.env.JWT_RT_SECRET, expiresIn: 60 * 60 * 24 * 7 }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
