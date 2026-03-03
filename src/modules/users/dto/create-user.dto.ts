import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { UserType } from '../enums/UserType.enum';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsEnum(UserType)
  type: UserType;
}
