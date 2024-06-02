import { EApproval } from 'src/utils/enum/approval.enum';
import { ELoanStatus } from 'src/utils/enum/loanStatus.enum';

export interface ILoanTrxGetAggregate {
  id: string;
  loanTypeId: string;
  instalmentTypeId: string;
  customerUserId: string;
  nominal: number;
  description: string;
  approvedBy: string;
  approvalStatus: EApproval;
  loanStatus: ELoanStatus;
  createdAt: Date;
  updatedAt: Date;
}
