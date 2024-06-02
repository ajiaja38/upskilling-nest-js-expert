import { IsNumber, IsString } from 'class-validator';

export class CreateLoanReqDto {
  @IsString()
  loanTypeId: string;

  @IsString()
  instalmentTypeId: string;

  @IsNumber()
  nominal: number;

  @IsString()
  description: string;
}
