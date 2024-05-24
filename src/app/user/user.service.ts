import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import User from './schema/user.schema';
import { MessageService } from '../message/message.service';
import { from, map, Observable } from 'rxjs';
import CreateUserDto from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { TimezoneService } from '../timezone/timezone.service';
import { ERole } from 'src/utils/enum/role.enum';
import { RoleService } from '../role/role.service';
import UserRoleTrx from '../role/schema/userRole.schema';
import Role from '../role/schema/role.schema';
import IResponseRegister from './dto/responseRegister.dto';
import { IGetUser } from './dto/responseGetUser.dto';
import UpdatePasswordDto from './dto/updatePassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userSchema: Model<User>,

    @InjectModel(UserRoleTrx.name)
    private readonly userRoleTrxSchema: Model<UserRoleTrx>,

    private readonly roleService: RoleService,
    private readonly messageService: MessageService,
    private readonly timeZoneService: TimezoneService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    isCustomer: boolean,
  ): Promise<IResponseRegister> {
    const { email } = createUserDto;

    const password: string = await bcrypt.hash(createUserDto.password, 12);
    const createdAt: string = this.timeZoneService.getTimeZone();
    const updatedAt: string = createdAt;

    const roleInputed: ERole[] = isCustomer
      ? [ERole.CUSTOMER]
      : [ERole.ADMIN, ERole.STAFF];

    const session = await this.userSchema.db.startSession();
    session.startTransaction();

    try {
      const user = await new this.userSchema({
        email,
        password,
        createdAt,
        updatedAt,
      }).save({ session });

      const userRole: ERole[] = [];

      for (const data of roleInputed) {
        const role: Role = await this.roleService.getOrSave(data, session);

        userRole.push(role.role);

        await new this.userRoleTrxSchema({
          userId: user.id,
          roleId: role.id,
        }).save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return {
        email: user.email,
        role: userRole,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new BadRequestException('Failed Create User, Transaction aborted');
    }
  }

  async getAllUser(): Promise<IGetUser[]> {
    this.messageService.setMessage('Get All User Successfully');
    return await this.userSchema
      .find()
      .select({ _id: 0, id: 1, email: 1, createdAt: 1, updatedAt: 1 });
  }

  getUserById(id: string): Observable<User> {
    return from(
      this.userSchema
        .findOne({ id })
        .select({ _id: 0, id: 1, email: 1, createdAt: 1, updatedAt: 1 }),
    ).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException('Maaf, User tidak ditemukan');
        }

        this.messageService.setMessage('Get User Successfully');
        return user;
      }),
    );
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { password, confirmPassword } = updatePasswordDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and Confirm Password Not Same');
    }

    const user = await this.userSchema.findOne({ id });

    if (!user) {
      throw new NotFoundException('User Notfound');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new BadRequestException('Password Wrong!');
    }

    await this.userSchema.findOneAndUpdate({ id }, { password }, { new: true });
  }
}
