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

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.userRepository.update(userId, { hashedRt: hash });
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException("Access Denied");

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    console.log(userId);
    await this.userRepository.update(userId, { hashedRt: null });
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user?.hashedRt) throw new ForbiddenException("Access Denied");

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);

    if (!rtMatches) throw new ForbiddenException("Access Denied");

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }, { secret: process.env.JWT_AT_SECRET, expiresIn: 60 * 15 }),
      this.jwtService.signAsync({ sub: userId, email }, { secret: process.env.JWT_RT_SECRET, expiresIn: 60 * 60 * 24 * 7 }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

