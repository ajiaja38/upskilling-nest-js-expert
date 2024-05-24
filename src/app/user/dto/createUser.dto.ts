import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
