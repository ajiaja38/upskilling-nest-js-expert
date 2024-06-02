import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EApproval } from 'src/utils/enum/approval.enum';
import { ELoanStatus } from 'src/utils/enum/loanStatus.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
})
export class LoanTransaction {
  @Prop({
    type: String,
    unique: true,
    default: () => `loanTransaction-${uuidv4()}`,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  loanTypeId: string;

  @Prop({
    type: String,
    required: true,
  })
  instalmentTypeId: string;

  @Prop({
    type: String,
    required: true,
  })
  customerId: string;

  @Prop({
    type: Number,
    required: true,
  })
  nominal: number;

  @Prop({
    type: String,
    default: null,
  })
  description: string;

  @Prop({
    type: String,
    default: null,
  })
  approvedBy: string;

  @Prop({
    type: String,
    default: EApproval.PENDING,
    enum: EApproval,
  })
  approvalStatus: EApproval;

  @Prop({
    type: String,
    default: ELoanStatus.UNPAID,
  })
  loanStatus: ELoanStatus;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const loanTransactionSchema =
  SchemaFactory.createForClass(LoanTransaction);
