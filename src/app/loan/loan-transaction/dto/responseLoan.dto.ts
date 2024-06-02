import { EApproval } from 'src/utils/enum/approval.enum';
import { EInstalmentType } from 'src/utils/enum/installment.enum';
import { ELoanStatus } from 'src/utils/enum/loanStatus.enum';

export interface ILoanTrx {
  id: string;
  loanType: string;
  instalmentType: EInstalmentType;
  customer: {
    name: string;
    email: string;
  };
  nominal: number;
  approvedBy: string;
  approvalStatus: EApproval;
  loanStatus: ELoanStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
