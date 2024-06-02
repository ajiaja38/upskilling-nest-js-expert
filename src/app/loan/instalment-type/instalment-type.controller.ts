import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InstalmentTypeService } from './instalment-type.service';
import { InstalmentTypeDto } from './dto/instalment.dto';
import { InstalmentType } from './schema/instalmentType.schema';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/guard/role/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { ERole } from 'src/utils/enum/role.enum';

@Controller('instalment-type')
@UseGuards(JwtAuthGuard, RoleGuard)
export class InstalmentTypeController {
  constructor(private readonly instalmentTypeService: InstalmentTypeService) {}

  @Post()
  @Roles(ERole.ADMIN, ERole.STAFF)
  createInstalmentType(
    @Body() instalmentTypeDto: InstalmentTypeDto,
  ): Promise<InstalmentType> {
    return this.instalmentTypeService.createInstalmentType(instalmentTypeDto);
  }

  @Get()
  @Roles(ERole.ADMIN, ERole.STAFF, ERole.CUSTOMER)
  getAllInstalmentType(): Promise<InstalmentType[]> {
    return this.instalmentTypeService.getAllInstalmentType();
  }

  @Get(':id')
  @Roles(ERole.ADMIN, ERole.STAFF, ERole.CUSTOMER)
  getInstalmentTypeById(@Param('id') id: string): Promise<InstalmentType> {
    return this.instalmentTypeService.getInstalmentTypeById(id);
  }

  @Put(':id')
  @Roles(ERole.ADMIN, ERole.STAFF)
  updateInstalmentType(
    @Param('id') id: string,
    @Body() instalmentTypeDto: InstalmentTypeDto,
  ): Promise<InstalmentType> {
    return this.instalmentTypeService.updateInstalmentType(
      id,
      instalmentTypeDto,
    );
  }

  @Delete(':id')
  @Roles(ERole.ADMIN, ERole.STAFF)
  deleteInstalmentType(@Param('id') id: string): Promise<void> {
    return this.instalmentTypeService.deleteInstalmentType(id);
  }
}
