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

    // subscription 'll created inactive (activate after payment success)
    return this.subscriptionRepository.save({
      planId: plan.id,
      userId,
      type: createSubscriptionDto.type,
      status: SubscriptionStatus.INACTIVE,
      expires_at: new Date(
        createSubscriptionDto.type === PlanType.MONTHLY
          ? Date.now() + 30 * 24 * 60 * 60 * 1000
          : Date.now() + 365 * 24 * 60 * 60 * 1000,
      ),
    });
  }

  async findAll() {
    return this.subscriptionRepository.find();
  }

  async findOne(id: string) {
    return this.subscriptionRepository.findOne({ where: { id } });
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
