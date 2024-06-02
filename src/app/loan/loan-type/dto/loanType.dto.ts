import { IsNumber, IsString } from 'class-validator';

export class LoanTypeDto {
  @IsString()
  loanType: string;

  @IsNumber()
  maxLoan: number;
}
