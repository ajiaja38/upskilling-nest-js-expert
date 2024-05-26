import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  Matches,
  MaxDate,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  @MaxDate(() => new Date(), {
    message: 'Tidak boleh melebihi tanggal sekarang',
  })
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+62\d{9,13}$/, {
    message:
      'Nomor Telepon harus diawali dengan +62 dan terdiri dari 9-13 angka',
  })
  phoneNumber: string;
}
