import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
    private readonly organizationService: OrganizationService,
  ) {}
  create(createPlanDto: CreatePlanDto) {
    return this.planRepository.save(createPlanDto);
  }

  subscribeToPlan(orgId: string, planId: string) {
    return this.organizationService.subscribeToPlan(orgId, planId);
  }

  findAll() {
    return this.planRepository.find();
  }

  findOne(id: string) {
    return this.planRepository.findOne({ where: { id } });
  }

  update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.planRepository.update(id, updatePlanDto);
  }

  remove(id: string) {
    return this.planRepository.delete(id);
  }
}
