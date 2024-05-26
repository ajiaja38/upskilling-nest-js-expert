import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/guard/role/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { ERole } from 'src/utils/enum/role.enum';
import { User } from 'src/decorators/User.decorator';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';
import { Customer } from './schema/customer.schema';
import { IGetCustomer } from './dto/getCustomer.dto';
import { UpdateCustomerDto } from './dto/UpdateCustomer.dto';

@Controller('customer')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  @Roles(ERole.ADMIN, ERole.STAFF)
  getCustomerByIdHandler(@Param('id') id: string): Promise<IGetCustomer> {
    return this.customerService.getCustomerById(id);
  }

  @Get('/profile')
  @Roles(ERole.CUSTOMER, ERole.ADMIN, ERole.STAFF)
  getProfileCustomerHandler(@User() user: IJwtPayload): Promise<IGetCustomer> {
    return this.customerService.getCustomerById(user.id);
  }

  @Put()
  @Roles(ERole.CUSTOMER)
  updateCustomerProfileHandler(
    @User() user: IJwtPayload,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.updateCustomer(user.id, updateCustomerDto);
  }
}
