import { Test, TestingModule } from '@nestjs/testing';
import { PresetController } from './preset.controller';

describe('PresetController', () => {
  let controller: PresetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetController],
    }).compile();

    controller = module.get<PresetController>(PresetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
