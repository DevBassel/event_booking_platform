import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @GetUser('userId') userId: string,
  ) {
    return this.subscriptionService.create(createSubscriptionDto, userId);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }
}
