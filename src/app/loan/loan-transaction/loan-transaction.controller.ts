import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LoanTransactionService } from './loan-transaction.service';
import { ILoanTrx } from './dto/responseLoan.dto';
import { CreateLoanReqDto } from './dto/createLoanReq.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/guard/role/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { ERole } from 'src/utils/enum/role.enum';
import { User } from 'src/decorators/User.decorator';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';
import { ApproveRejectDto } from './dto/approveReject.dto';

@Controller('loan-transaction')
@UseGuards(JwtAuthGuard, RoleGuard)
export class LoanTransactionController {
  constructor(
    private readonly loanTransactionService: LoanTransactionService,
  ) {}

  @Post()
  @Roles(ERole.CUSTOMER)
  createLoanReqTransaction(
    @Body() createLoanReqDto: CreateLoanReqDto,
    @User() user: IJwtPayload,
  ): Promise<ILoanTrx> {
    return this.loanTransactionService.createLoanTransaction(
      user.id,
      createLoanReqDto,
    );
  }

  @Put(':id/approval')
  @Roles(ERole.ADMIN, ERole.STAFF)
  actionLoanTrxByAdmin(
    @User() user: IJwtPayload,
    @Param('id') id: string,
    @Body() approveRejectDto: ApproveRejectDto,
  ): Promise<ILoanTrx> {
    return this.loanTransactionService.actionLoanTrxByAdmin(
      user.email,
      id,
      approveRejectDto,
    );
  }
}
