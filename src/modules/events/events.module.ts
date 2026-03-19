import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { OrganizationModule } from '../organization/organization.module';
import { CategoriesModule } from '../categories/categories.module';
import { EventDetailsService } from './event_details.service';
import { EventDetail } from './entities/event_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventDetail]),
    OrganizationModule,
    CategoriesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventDetailsService],
})
export class EventsModule {}
