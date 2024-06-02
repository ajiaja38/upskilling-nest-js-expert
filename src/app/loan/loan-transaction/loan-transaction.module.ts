import { Module } from '@nestjs/common';
import { LoanTransactionService } from './loan-transaction.service';
import { LoanTransactionController } from './loan-transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoanTransaction,
  loanTransactionSchema,
} from './schema/loanTransaction.schema';
import { TimezoneModule } from 'src/app/timezone/timezone.module';
import { CustomerModule } from 'src/app/customer/customer.module';
import { LoanTypeModule } from '../loan-type/loan-type.module';
import { InstalmentTypeModule } from '../instalment-type/instalment-type.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoanTransaction.name, schema: loanTransactionSchema },
    ]),
    CustomerModule,
    LoanTypeModule,
    InstalmentTypeModule,
    TimezoneModule,
  ],
  controllers: [LoanTransactionController],
  providers: [LoanTransactionService],
})
export class LoanTransactionModule {}
