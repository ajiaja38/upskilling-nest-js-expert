import { Test, TestingModule } from '@nestjs/testing';
import { LoanTransactionController } from './loan-transaction.controller';
import { LoanTransactionService } from './loan-transaction.service';

describe('LoanTransactionController', () => {
  let controller: LoanTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanTransactionController],
      providers: [LoanTransactionService],
    }).compile();

    controller = module.get<LoanTransactionController>(LoanTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
