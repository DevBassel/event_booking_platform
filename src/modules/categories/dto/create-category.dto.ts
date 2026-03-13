import { IsArray, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsArray()
  sub_categories: string[];

  @IsUrl()
  logo_url: string;
}
