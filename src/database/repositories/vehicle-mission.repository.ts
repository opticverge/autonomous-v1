import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { VehicleMissionEntity } from '@autonomous/database/entities';
import { CreateVehicleMission, VehicleMission } from '@autonomous/shared/types';
import { Nullable } from '@autonomous/common/types';

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

  async findAll(): Promise<VehicleMission[]> {
    const mission = await this.repository.find();
    if (!mission) return [];
    return mission.map((mission) => {
      const { _id: _, ...response } = mission;
      return response;
    });
  }

  async findByIds(ids: string[]) {
    const entities = await this.repository.find({
      where: { vehicleId: { $in: ids } },
    });

    if (!entities) return [];

    return entities.map((entity) => {
      const { _id: _, ...response } = entity;
      return response;
    });
  }

  async findById(vehicleMissionId: string): Promise<Nullable<VehicleMission>> {
    const entity = await this.repository.findOne({
      where: { vehicleMissionId },
    });
    if (!entity) return null;
    const { _id: _, ...response } = entity;
    return response;
  }
}
