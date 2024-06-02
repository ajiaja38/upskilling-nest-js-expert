import { Module } from '@nestjs/common';
import { InstalmentTypeService } from './instalment-type.service';
import { InstalmentTypeController } from './instalment-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InstalmentType,
  instalmentTypeSchema,
} from './schema/instalmentType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstalmentType.name, schema: instalmentTypeSchema },
    ]),
  ],
  controllers: [InstalmentTypeController],
  providers: [InstalmentTypeService],
  exports: [InstalmentTypeService],
})
export class InstalmentTypeModule {}
