import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  slug: string;

  @IsString()
  phone: string;

  @IsString()
  logo_url: string;

  @IsString()
  domain: string;

  @IsOptional()
  @IsUUID()
  userId: string;

  @IsString()
  @Length(6, 255)
  description: string;
}
