import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { VehicleMissionEntity } from '@autonomous/database/entities';
import { VehicleMission } from '@autonomous/shared/types';

@Injectable()
export class VehicleMissionRepository {
  constructor(
    @InjectRepository(VehicleMissionEntity)
    private readonly repository: MongoRepository<VehicleMissionEntity>,
  ) {}

  async create(data: VehicleMission) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
}
