import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { SubscriptionStatus } from './enums/SubscriptionStatus.enum';
import { PlansService } from '../plans/plans.service';
import { PlanType } from './enums/PlanType.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly plansService: PlansService,
    private readonly usersService: UsersService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, userId: string) {
    const plan = await this.plansService.findOne(createSubscriptionDto.planId);

    const user = await this.usersService.findOne(userId);
    if (user.subscription) {
      throw new BadRequestException('User already have subscription');
    }

    const expiresAt = new Date();
    expiresAt.setUTCHours(0, 0, 0, 0);
    if (createSubscriptionDto.type === PlanType.MONTHLY)
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    else expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // subscription 'll created inactive (activate after payment success)
    return this.subscriptionRepository.save({
      planId: plan.id,
      userId,
      type: createSubscriptionDto.type,
      status: SubscriptionStatus.INACTIVE,
      expires_at: expiresAt,
    });
  }

  async findAll() {
    return this.subscriptionRepository.find();
  }

  findUserSubscription(userId: string) {
    return this.subscriptionRepository.findOne({
      where: { userId },
      relations: ['plan'],
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionRepository.update(id, updateSubscriptionDto);
  }

  async remove(id: string) {
    return this.subscriptionRepository.update(id, {
      status: SubscriptionStatus.INACTIVE,
    });
  }
}
