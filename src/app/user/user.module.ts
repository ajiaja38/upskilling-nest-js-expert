import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from './schema/user.schema';
import { MessageModule } from '../message/message.module';
import { TimezoneModule } from '../timezone/timezone.module';
import { RoleModule } from '../role/role.module';
import UserRoleTrx, { UserRoleTrxSchema } from '../role/schema/userRole.schema';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRoleTrx.name, schema: UserRoleTrxSchema },
    ]),
    MessageModule,
    TimezoneModule,
    RoleModule,
    CustomerModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
