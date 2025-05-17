import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { VehicleMissionEntity } from '@autonomous/database/entities';
import { CreateVehicleMission, VehicleMission } from '@autonomous/shared/types';

@Injectable()
export class VehicleMissionRepository {
  constructor(
    @InjectRepository(VehicleMissionEntity)
    private readonly repository: MongoRepository<VehicleMissionEntity>,
  ) {}

  async create(data: CreateVehicleMission): Promise<VehicleMission> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    const { _id: _, ...response } = saved;
    return response;
  }
}
