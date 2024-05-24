import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
})
export default class User {
  @Prop({
    type: String,
    unique: true,
    default: () => `user-${uuidv4()}`,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  password: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
