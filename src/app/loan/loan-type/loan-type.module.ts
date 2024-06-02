import { Module } from '@nestjs/common';
import { LoanTypeService } from './loan-type.service';
import { LoanTypeController } from './loan-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoanType, loanTypeSchema } from './schema/LoanType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoanType.name, schema: loanTypeSchema },
    ]),
  ],
  controllers: [LoanTypeController],
  providers: [LoanTypeService],
})
export class LoanTypeModule {}
