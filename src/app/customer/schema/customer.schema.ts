import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CustomerStatus } from 'src/utils/enum/customerStatus.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
})
export class Customer {
  @Prop({
    type: String,
    default: () => `customer-${uuidv4()}`,
    unique: true,
  })
  id: string;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: Date,
    default: null,
  })
  birthDate: Date;

  @Prop({
    type: String,
    default: null,
  })
  phoneNumber: string;

  @Prop({
    type: String,
    enum: CustomerStatus,
    default: CustomerStatus.INACTIVE,
  })
  status: CustomerStatus;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

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

export const customerSchema = SchemaFactory.createForClass(Customer);
