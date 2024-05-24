/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/enitities/user.entity";
import { LogService } from "src/logger/log.service";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private loggerService: LogService,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }
}
