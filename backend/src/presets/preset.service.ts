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

  async findPresetById(id: string): Promise<Preset> {
    return this.presetRepository.findOne({ where: { id: id } });
  }

async updatePreset(id: string, data: UpdatePresetDto): Promise<Preset> {
  this.logger.debug("Serviço de atualização de preset esperando");
  const result = await this.presetRepository.update(id, data);
  if (result.affected === 0) {
    throw new NotFoundException(`Preset with ID "${id}" not found`);
  }
  this.logger.debug("Serviço de atualização de preset acionado");
  return this.presetRepository.findOne({ where: { id: id } });
}

  async deletePreset(id: string): Promise<void> {
    const result = await this.presetRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Preset with ID "${id}" not found`);
    }
  }

}
