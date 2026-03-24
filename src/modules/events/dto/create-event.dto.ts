import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsUrl()
  @IsNotEmpty()
  map_location: string;

  @IsInt()
  @Min(1)
  col_count: number;

  @IsInt()
  @Min(1)
  rows_count: number;

  @IsDate()
  @Type(() => Date)
  start_at: Date;

  @IsDate()
  @Type(() => Date)
  end_at: Date;

  @IsBoolean()
  isCanceled: boolean;
}
