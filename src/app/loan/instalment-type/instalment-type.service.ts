import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InstalmentType } from './schema/instalmentType.schema';
import { Model } from 'mongoose';
import { InstalmentTypeDto } from './dto/instalment.dto';

@Injectable()
export class InstalmentTypeService {
  constructor(
    @InjectModel(InstalmentType.name)
    private instalmentTypeSchema: Model<InstalmentType>,
  ) {}

  async createInstalmentType(
    instalmentTypeDto: InstalmentTypeDto,
  ): Promise<InstalmentType> {
    return await this.instalmentTypeSchema.create(instalmentTypeDto);
  }

  async getAllInstalmentType(): Promise<InstalmentType[]> {
    return await this.instalmentTypeSchema.find();
  }

  async getInstalmentTypeById(id: string): Promise<InstalmentType> {
    const instalmentType: InstalmentType =
      await this.instalmentTypeSchema.findOne({ id });

    if (!instalmentType)
      throw new NotFoundException('InstalmentType Not Found');

    return instalmentType;
  }

  async updateInstalmentType(
    id: string,
    instalmentTypeDto: InstalmentTypeDto,
  ): Promise<InstalmentType> {
    const updatedInstalmentType: InstalmentType =
      await this.instalmentTypeSchema.findOneAndUpdate(
        { id },
        { ...instalmentTypeDto },
        { new: true },
      );

    if (updatedInstalmentType)
      throw new NotFoundException('InstalmentType Not Found');

    return updatedInstalmentType;
  }

  async deleteInstalmentType(id: string): Promise<void> {
    await this.instalmentTypeSchema.findOneAndDelete({ id });
  }
}
