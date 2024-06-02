import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoanType } from './schema/LoanType.schema';
import { ClientSession, Model } from 'mongoose';
import { LoanTypeDto } from './dto/loanType.dto';

@Injectable()
export class LoanTypeService {
  constructor(
    @InjectModel(LoanType.name)
    private loanTypeSchema: Model<LoanType>,
  ) {}

  async createLoanType(loanTypeDto: LoanTypeDto): Promise<LoanType> {
    return await this.loanTypeSchema.create(loanTypeDto);
  }

  async getAllLoanType(): Promise<LoanType[]> {
    return await this.loanTypeSchema
      .find()
      .select('id loanType maxLoan createdAt updatedAt');
  }

  async getLoanTypeById(
    id: string,
    session?: ClientSession,
  ): Promise<LoanType> {
    const loanType: LoanType = await this.loanTypeSchema
      .findOne({ id }, {}, { session })
      .select('id loanType maxLoan createdAt updatedAt');

    if (!loanType) throw new NotFoundException('LoanType Not Found');

    return loanType;
  }
}
