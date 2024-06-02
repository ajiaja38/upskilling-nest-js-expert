import { Module } from '@nestjs/common';
import { LoanTypeModule } from './loan-type/loan-type.module';
import { LoanTransactionModule } from './loan-transaction/loan-transaction.module';
import { InstalmentTypeModule } from './instalment-type/instalment-type.module';

@Module({
  imports: [LoanTypeModule, LoanTransactionModule, InstalmentTypeModule],
})
export class LoanModule {}
