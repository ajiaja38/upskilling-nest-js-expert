import { Test, TestingModule } from '@nestjs/testing';
import { LoanTransactionService } from './loan-transaction.service';

describe('LoanTransactionService', () => {
  let service: LoanTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanTransactionService],
    }).compile();

    service = module.get<LoanTransactionService>(LoanTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
