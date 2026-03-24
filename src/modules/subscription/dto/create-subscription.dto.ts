import { IsEnum, IsUUID } from 'class-validator';
import { PlanType } from '../enums/PlanType.enum';

export class CreateSubscriptionDto {
  @IsUUID()
  planId: string;

  @IsEnum(PlanType)
  type: PlanType;
}
