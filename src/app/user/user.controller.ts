import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import IResponseRegister from './dto/responseRegister.dto';
import CreateUserDto from './dto/createUser.dto';
import { IGetUserDetail } from './dto/responseGetUser.dto';
import UpdatePasswordDto from './dto/updatePassword.dto';
import { IResponsePageWrapper } from 'src/utils/interface/responsePageWrapper.interface';
import { JwtAuthGuard } from 'src/guard/jwt-auth/jwt-auth.guard';
import { RoleGuard } from 'src/guard/role/role.guard';
import { Roles } from 'src/decorators/Roles.decorator';
import { ERole } from 'src/utils/enum/role.enum';
import { User } from 'src/decorators/User.decorator';
import { IJwtPayload } from 'src/utils/interface/jwtPayload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUserHandler(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponseRegister> {
    return this.userService.createUser(createUserDto, true);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN, ERole.STAFF)
  getAllUserHandler(): Promise<IGetUserDetail[]> {
    return this.userService.getAllUser();
  }

  @Get('/pagination/option')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN, ERole.STAFF)
  getAllUsersHandlerPagination(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ): Promise<IResponsePageWrapper<IGetUserDetail[]>> {
    return this.userService.getAllUserPagination(page, limit, search);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserByIdHandler(@Param('id') id: string): Promise<IGetUserDetail> {
    return this.userService.getUserById(id);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfileHandler(@User() user: IJwtPayload): Promise<IGetUserDetail> {
    return this.userService.getUserById(user.id);
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  updatePasswordHandler(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  deleteUserHandler(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
