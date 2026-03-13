import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { pagination } from 'src/utils/pagination.utils';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}
  create(createOrganizationDto: CreateOrganizationDto) {
    return this.orgRepo.save(createOrganizationDto);
  }

  findAll(page: number, limit: number) {
    return pagination<Organization>(
      this.orgRepo
        .createQueryBuilder('org')
        .leftJoinAndSelect('org.user', 'user'),
      page,
      limit,
    );
  }

  findOne(id: string) {
    return this.orgRepo.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.orgRepo.update({ id }, updateOrganizationDto);
  }

  remove(id: string) {
    return this.orgRepo.delete({ id });
  }

  subscribeToPlan(orgId: string, planId: string) {
    return this.orgRepo.update({ id: orgId }, { planId });
  }
}
