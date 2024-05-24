import { IsEmail } from 'class-validator';

export default class UpdateUserDto {
  @IsEmail()
  email: string;
}
