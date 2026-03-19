import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../../utils/decorators/role.decorator';
import { UserRoles } from '../users/enums/UserType.enum';
import { GetUser } from 'src/utils/decorators/get-user.decorator';
import { LoginPayload } from '../auth/dto/LoginPayload.dto';

@Controller('events')
@UseGuards(JwtAuthGuard, RoleGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles([UserRoles.ADMIN, UserRoles.ORGANIZER])
  create(
    @Body() createEventDto: CreateEventDto,
    @GetUser('userId') userId: string,
  ) {
    return this.eventsService.create(createEventDto, userId);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @GetUser('userId') userId: string,
  ) {
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: LoginPayload) {
    return this.eventsService.remove(id, user);
  }
}
