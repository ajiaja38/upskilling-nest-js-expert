import { Module } from '@nestjs/common';
import { LoanTransactionService } from './loan-transaction.service';
import { LoanTransactionController } from './loan-transaction.controller';

@Module({
  controllers: [LoanTransactionController],
  providers: [LoanTransactionService],
})
export class LoanTransactionModule {}
