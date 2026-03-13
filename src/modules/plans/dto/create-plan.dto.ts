import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  countOfEvents: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  monthlyPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  yearlyPrice: number;

  @IsString()
  description: string;

  @IsArray()
  features: string[];
}
