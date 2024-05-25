import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import User from './schema/user.schema';
import { MessageService } from '../message/message.service';
import CreateUserDto from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { TimezoneService } from '../timezone/timezone.service';
import { ERole } from 'src/utils/enum/role.enum';
import { RoleService } from '../role/role.service';
import UserRoleTrx from '../role/schema/userRole.schema';
import Role from '../role/schema/role.schema';
import IResponseRegister from './dto/responseRegister.dto';
import { IGetUserDetail } from './dto/responseGetUser.dto';
import UpdatePasswordDto from './dto/updatePassword.dto';
import {
  ImetaPagination,
  IResponsePageWrapper,
} from 'src/utils/interface/responsePageWrapper.interface';

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

    const session: ClientSession = await this.userSchema.db.startSession();
    session.startTransaction();

    try {
      const user: User = await new this.userSchema({
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

      return {
        email: user.email,
        role: userRole,
      };
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message);
    } finally {
      session.endSession();
    }
  }

  async getAllUser(): Promise<IGetUserDetail[]> {
    this.messageService.setMessage('Get All User Successfully');

    const session: ClientSession = await this.userSchema.db.startSession();
    session.startTransaction();

    try {
      const users: User[] = await this.userSchema.find({}, {}, { session });
      let results: IGetUserDetail[] = [];

      for (const user of users) {
        const roleTrxs: UserRoleTrx[] =
          await this.roleService.getRoleTrxByUserId(user.id, session);

        let roles: ERole[] = [];

        for (const trx of roleTrxs) {
          const role: Role = await this.roleService.getRoleById(
            trx.roleId,
            session,
          );
          roles = [...roles, role.role];
        }

        results = [
          ...results,
          {
            id: user.id,
            email: user.email,
            roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        ];
      }

      await session.commitTransaction();

      return results
        .filter((result) => result.roles.includes(ERole.CUSTOMER))
        .reverse();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error.message);
    } finally {
      session.endSession();
    }
  }

  async getAllUserPagination(
    page: number,
    limit: number,
    search: string,
  ): Promise<IResponsePageWrapper<IGetUserDetail[]>> {
    this.messageService.setMessage('Get All User Successfully');

    const skip = (page - 1) * limit;

    const [users, totalData] = await Promise.all([
      this.userSchema
        .aggregate([
          {
            $lookup: {
              from: 'roleTransaction',
              localField: 'id',
              foreignField: 'userId',
              as: 'roleTransaction',
            },
          },
          { $unwind: '$roleTransaction' },
          {
            $lookup: {
              from: 'roles',
              localField: 'roleTransaction.roleId',
              foreignField: 'id',
              as: 'roles',
            },
          },
          {
            $match: {
              'roles.role': 'Customer',
              email: { $regex: new RegExp(search, 'i') },
            },
          },
          {
            $group: {
              _id: '$id',
              email: { $first: '$email' },
              createdAt: { $first: '$createdAt' },
              updatedAt: { $first: '$updatedAt' },
              roles: { $push: '$roles.role' },
            },
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              email: 1,
              roles: {
                $reduce: {
                  input: '$roles',
                  initialValue: [],
                  in: { $concatArrays: ['$$value', '$$this'] },
                },
              },
              createdAt: 1,
              updatedAt: 1,
            },
          },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec(),
      this.userSchema.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    const meta: ImetaPagination = {
      totalPages,
      totalData,
      totalDataPerPage: users.length,
      page,
      limit,
    };

    const response: IResponsePageWrapper<IGetUserDetail[]> = {
      data: users,
      meta,
    };

    return response;
  }

  async getUserById(id: string): Promise<IGetUserDetail> {
    const user: IGetUserDetail[] = await this.getUserAggregate(id);

    if (!user.length) {
      throw new NotFoundException('User Not Found');
    }

    this.messageService.setMessage('Get User Successfully');

    return user[0];
  }

  async getUserAggregate(id?: string): Promise<IGetUserDetail[]> {
    return await this.userSchema.aggregate([
      ...(id ? [{ $match: { id } }] : []),
      {
        $lookup: {
          from: 'roleTransaction',
          localField: 'id',
          foreignField: 'userId',
          as: 'roleTransaction',
        },
      },
      { $unwind: '$roleTransaction' },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleTransaction.roleId',
          foreignField: 'id',
          as: 'roles',
        },
      },
      {
        $group: {
          _id: '$id',
          email: { $first: '$email' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          roles: { $push: '$roles.role' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          email: 1,
          roles: {
            $reduce: {
              input: '$roles',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword, confirmPassword } = updatePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Password and Confirm Password Not Same');
    }

    const user: User = await this.userSchema.findOne({ id });

    if (!user) {
      throw new NotFoundException('User Notfound');
    }

    const passwordIsValid: boolean = await bcrypt.compare(
      oldPassword,
      user.password,
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Password Wrong!');
    }

    await this.userSchema.findOneAndUpdate(
      { id },
      { password: await bcrypt.hash(newPassword, 12) },
      { new: true },
    );

    this.messageService.setMessage('Update Password Successfully');
  }

  async deleteUser(id: string): Promise<void> {
    const session: ClientSession = await this.userSchema.db.startSession();
    session.startTransaction();

    try {
      const user: User = await this.userSchema.findOne({ id }, {}, { session });

      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      await this.userSchema.deleteOne({ id }, { session });
      await this.roleService.deleteRoleTrxByUserId(id, session);

      await session.commitTransaction();
      this.messageService.setMessage('Delete User Successfully');
    } catch (error) {
      await session.abortTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      session.endSession();
    }
  }
}
