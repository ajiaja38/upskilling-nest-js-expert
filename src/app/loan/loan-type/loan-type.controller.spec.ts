import { Test, TestingModule } from '@nestjs/testing';
import { LoanTypeController } from './loan-type.controller';
import { LoanTypeService } from './loan-type.service';

describe('LoanTypeController', () => {
  let controller: LoanTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanTypeController],
      providers: [LoanTypeService],
    }).compile();

    controller = module.get<LoanTypeController>(LoanTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
