import {
  IsString,
  IsInt,
  IsBoolean,
  IsDate,
  IsUrl,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDetailDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsUrl()
  @IsNotEmpty()
  map_location: string;

  @IsInt()
  @Min(1)
  seats_count: number;

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
