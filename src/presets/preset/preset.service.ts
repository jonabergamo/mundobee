import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePresetDto, UpdatePresetDto } from "./dto";
import { Preset } from "./entities/preset.entity";
import { LogService } from "src/logger/log.service";
import { User } from "src/auth/enitities/user.entity";

@Injectable()
export class PresetService {
  constructor(
    @InjectRepository(Preset)
    private presetRepository: Repository<Preset>,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    private logger: LogService,
  ) {}

  async createPreset(data: CreatePresetDto): Promise<Preset> {
    const preset = this.presetRepository.create(data);
    this.logger.debug("Serviço de criação de preset acionado");
    return this.presetRepository.save(preset);
  }

  async findAllPresets(): Promise<Preset[]> {
    return this.presetRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} preset`;
  }

  update(id: number, updatePresetDto: UpdatePresetDto) {
    return `This action updates a #${id} preset`;
  }

  remove(id: number) {
    return `This action removes a #${id} preset`;
  }
}
