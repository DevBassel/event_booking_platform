import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { OrganizationService } from '../organization/organization.service';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';
import { LoginPayload } from '../auth/dto/LoginPayload.dto';
import { UserRoles } from '../users/enums/UserType.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    private readonly orgService: OrganizationService,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}
  async create(createEventDto: CreateEventDto, userId: string) {
    const org = await this.orgService.findOne(createEventDto.organizationId);
    if (org.userId !== userId)
      throw new UnauthorizedException('can not create an event');

    return this.eventRepo.save({
      ...createEventDto,
      categories: createEventDto.categories.map((c) => ({
        id: c,
      })),
    });
  }

  findAll() {
    return this.eventRepo.find({
      relations: { organization: true, categories: true },
      select: {
        categories: {
          id: true,
          name: true,
          logo_url: true,
        },
        organization: {
          id: true,
          name: true,
          logo_url: true,
          domain: true,
        },
      },
    });
  }

  findOne(id: string) {
    return this.eventRepo.findOne({
      where: { id },
      relations: { organization: true, categories: true },
      select: {
        categories: {
          id: true,
          name: true,
          logo_url: true,
        },
        organization: {
          id: true,
          name: true,
          logo_url: true,
          domain: true,
        },
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    const { categories, ...eventData } = dto;
    await this.categoriesService.checkCatigoris(categories);

    delete eventData.organizationId;
    await this.eventRepo.update(id, eventData);

    if (categories) {
      const relation = this.eventRepo
        .createQueryBuilder()
        .relation(Event, 'categories')
        .of(id);
      await relation.addAndRemove(categories, await relation.loadMany());
    }
    return this.findOne(id);
  }

  async remove(id: string, user: LoginPayload) {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException();

    const userOrg = await this.orgService.findUserOrg(user.userId);

    if (user.role !== UserRoles.ADMIN || userOrg.id !== event.organizationId)
      throw new UnauthorizedException();

    return this.eventRepo.delete({ id });
  }
}
