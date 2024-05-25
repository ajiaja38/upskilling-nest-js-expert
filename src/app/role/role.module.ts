import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import Role, { RoleSchema } from './schema/role.schema';
import UserRoleTrx, { UserRoleTrxSchema } from './schema/userRole.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: UserRoleTrx.name, schema: UserRoleTrxSchema },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
