import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ERole } from 'src/utils/enum/role.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
})
export default class Role {
  @Prop({
    type: String,
    unique: true,
    default: () => `role-${uuidv4()}`,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    enum: ERole,
  })
  role: ERole;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
