import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
