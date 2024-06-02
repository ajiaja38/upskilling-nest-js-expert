import { IsEnum, IsString } from 'class-validator';
import { EInstalmentType } from 'src/utils/enum/installment.enum';

export class InstalmentTypeDto {
  @IsString()
  @IsEnum(EInstalmentType, {
    message:
      'Instalment type must be one of the following: One Month, Three Month, Sixth Month, Nine Month, Twelve Month',
  })
  instalmentType: EInstalmentType;
}
