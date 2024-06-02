import { Test, TestingModule } from '@nestjs/testing';
import { InstalmentTypeController } from './instalment-type.controller';
import { InstalmentTypeService } from './instalment-type.service';

describe('InstalmentTypeController', () => {
  let controller: InstalmentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstalmentTypeController],
      providers: [InstalmentTypeService],
    }).compile();

    controller = module.get<InstalmentTypeController>(InstalmentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
