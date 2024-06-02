import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EInstalmentType } from 'src/utils/enum/installment.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class InstalmentType {
  @Prop({
    type: String,
    unique: true,
    default: () => `Instalment-${uuidv4()}`,
  })
  id: string;

  @Prop({
    type: String,
    unique: true,
    enum: EInstalmentType,
    required: true,
  })
  instalmentType: EInstalmentType;
}

export const instalmentTypeSchema =
  SchemaFactory.createForClass(InstalmentType);
