import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoanTypeService } from './loan-type.service';
import { LoanTypeDto } from './dto/loanType.dto';
import { LoanType } from './schema/LoanType.schema';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/guard/role/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { ERole } from 'src/utils/enum/role.enum';

@Controller('loan-type')
@UseGuards(JwtAuthGuard, RoleGuard)
export class LoanTypeController {
  constructor(private readonly loanTypeService: LoanTypeService) {}

  @Post()
  @Roles(ERole.ADMIN, ERole.STAFF)
  createLoanTypeHandler(@Body() loanTypeDto: LoanTypeDto): Promise<LoanType> {
    return this.loanTypeService.createLoanType(loanTypeDto);
  }

  @Get()
  @Roles(ERole.ADMIN, ERole.STAFF, ERole.CUSTOMER)
  getAllLoanTypesHandler(): Promise<LoanType[]> {
    return this.loanTypeService.getAllLoanType();
  }

  @Get(':id')
  @Roles(ERole.ADMIN, ERole.STAFF, ERole.CUSTOMER)
  getLoanTypeByIdHandler(@Param('id') id: string): Promise<LoanType> {
    return this.loanTypeService.getLoanTypeById(id);
  }
}
