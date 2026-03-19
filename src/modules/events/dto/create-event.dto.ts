import { IsArray, IsBoolean, IsString, IsUUID, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(2, 60)
  title: string;

  @IsString()
  @Length(2, 60)
  slug: string;

  @IsString()
  @Length(2, 90)
  short_description: string;

  @IsString()
  long_description: string;

  @IsBoolean()
  is_published: boolean;

  @IsArray()
  @IsUUID('all', { each: true })
  categories: string[];
}
