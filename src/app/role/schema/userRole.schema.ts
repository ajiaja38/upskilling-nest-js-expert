import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
  collection: 'roleTransaction',
})
export default class UserRoleTrx {
  @Prop({
    type: String,
    unique: true,
    default: () => `role-trx${uuidv4()}`,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  roleId: string;
}

export const UserRoleTrxSchema = SchemaFactory.createForClass(UserRoleTrx);
