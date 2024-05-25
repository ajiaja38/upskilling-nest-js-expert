import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Role from './schema/role.schema';
import { ClientSession, Model } from 'mongoose';
import { ERole } from 'src/utils/enum/role.enum';
import UserRoleTrx from './schema/userRole.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    @InjectModel(UserRoleTrx.name)
    private readonly roleTrxSchema: Model<UserRoleTrx>,
  ) {}

  async getOrSave(role: ERole, session: ClientSession): Promise<Role> {
    const existingRole: Role = await this.roleModel.findOne({ role });

    if (!existingRole) {
      const newRole: Role = await new this.roleModel({
        role: role,
      }).save({ session });

      return newRole;
    }

    return existingRole;
  }

  async getRoleById(id: string, session?: ClientSession): Promise<Role> {
    const role: Role = await this.roleModel.findOne({ id }, {}, { session });

    if (!role) {
      throw new NotFoundException('Role Not Found');
    }

    return role;
  }

  async getRoleTrxByUserId(
    userId: string,
    session?: ClientSession,
  ): Promise<UserRoleTrx[]> {
    const roleTrx: UserRoleTrx[] = await this.roleTrxSchema.find(
      { userId },
      {},
      { session },
    );

    if (!roleTrx) {
      throw new NotFoundException('Role Transaction Not Found');
    }

    return roleTrx;
  }
}
