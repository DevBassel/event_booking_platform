import {
  BadRequestException,
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
import { LoginPayload } from '../auth/dto/LoginPayload.dto';
import { UserRoles } from '../users/enums/UserType.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    private readonly orgService: OrganizationService,
    private readonly categoriesService: CategoriesService,
  ) {}
  async create(createEventDto: CreateEventDto, userId: string) {
    const org = await this.orgService.findUserOrg(userId);
    await this.categoriesService.checkCategories(createEventDto.categories);

    const event = await this.eventRepo.save({
      ...createEventDto,
      categories: createEventDto.categories.map((c) => ({
        id: c,
      })),
      organizationId: org.id,
      capacity: createEventDto.col_count * createEventDto.rows_count,
    });

    return event;
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

  async findOne(id: string) {
    const e = await this.eventRepo.findOne({
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
    if (!e) throw new NotFoundException(`not found event by id => ${id} `);
    return e;
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const { categories, ...eventData } = dto;
    const org = await this.orgService.findUserOrg(userId);
    if (!org)
      throw new BadRequestException(
        'you are not a manager of any organization',
      );

    await this.categoriesService.checkCategories(categories);

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
