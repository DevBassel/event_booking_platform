import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { UserRoles } from '../users/enums/UserType.enum';
import { IReq } from 'src/utils/interfaces/Req.interface';

@Controller('events')
@UseGuards(JwtAuthGuard, RoleGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles([UserRoles.ADMIN, UserRoles.ORGANIZER])
  create(@Body() createEventDto: CreateEventDto, @Req() req: IReq) {
    return this.eventsService.create(createEventDto, req.user.userId);
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
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: IReq) {
    return this.eventsService.remove(id, req.user.userId);
  }
}
