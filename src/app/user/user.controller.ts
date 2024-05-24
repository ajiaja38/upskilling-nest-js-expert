import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import User from './schema/user.schema';
import IResponseRegister from './dto/responseRegister.dto';
import CreateUserDto from './dto/createUser.dto';
import { IGetUser } from './dto/responseGetUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUserHandler(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponseRegister> {
    return this.userService.createUser(createUserDto, false);
  }

  @Get()
  getAllUserHandler(): Promise<IGetUser[]> {
    return this.userService.getAllUser();
  }

  @Get(':id')
  getUserByIdHandler(@Param('id') id: string): Observable<User> {
    return this.userService.getUserById(id);
  }
}
