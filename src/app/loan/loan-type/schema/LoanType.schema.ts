import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class LoanType {
  @Prop({
    type: String,
    unique: true,
    default: () => `loanType-${uuidv4()}`,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  loanType: string;

  @Prop({
    type: Number,
    required: true,
  })
  maxLoan: number;
}

export const loanTypeSchema = SchemaFactory.createForClass(LoanType);
