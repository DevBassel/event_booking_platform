import { Injectable } from '@nestjs/common';
import { CreateEventDetailDto } from './dto/create-event_detail.dto';
import { UpdateEventDetailDto } from './dto/update-event_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDetail } from './entities/event_detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventDetailsService {
  constructor(
    @InjectRepository(EventDetail)
    private readonly eventDetailsRepo: Repository<EventDetail>,
  ) {}
  create(createEventDetailDto: CreateEventDetailDto) {
    return this.eventDetailsRepo.create(createEventDetailDto);
  }

  update(id: string, updateEventDetailDto: UpdateEventDetailDto) {
    return this.eventDetailsRepo.update(id, updateEventDetailDto);
  }

  remove(id: string) {
    return this.eventDetailsRepo.delete(id);
  }
}
