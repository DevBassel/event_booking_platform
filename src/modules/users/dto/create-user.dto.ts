import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRoles } from '../enums/UserType.enum';
import { CreateOrganizationDto } from 'src/modules/organization/dto/create-organization.dto';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsEnum(UserRoles)
  role: UserRoles;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrganizationDto)
  organization?: CreateOrganizationDto;
}
