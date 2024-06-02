import { Test, TestingModule } from '@nestjs/testing';
import { InstalmentTypeService } from './instalment-type.service';

describe('InstalmentTypeService', () => {
  let service: InstalmentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstalmentTypeService],
    }).compile();

    service = module.get<InstalmentTypeService>(InstalmentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
