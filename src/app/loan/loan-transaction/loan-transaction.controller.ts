import { Controller } from '@nestjs/common';
import { LoanTransactionService } from './loan-transaction.service';

@Controller('loan-transaction')
export class LoanTransactionController {
  constructor(private readonly loanTransactionService: LoanTransactionService) {}
}
