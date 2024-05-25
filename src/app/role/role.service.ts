import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Role from './schema/role.schema';
import { ClientSession, Model } from 'mongoose';
import { ERole } from 'src/utils/enum/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
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
}
