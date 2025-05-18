import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleMissionStatusEntity } from '@autonomous/database/entities';
import { MongoRepository } from 'typeorm';
import {
  CreateVehicleMissionStatus,
  VehicleMissionStatus,
} from '@autonomous/shared/types';
import { DateTime } from 'luxon';

@Injectable()
export class VehicleMissionStatusRepository {
  constructor(
    @InjectRepository(VehicleMissionStatusEntity)
    private readonly repository: MongoRepository<VehicleMissionStatusEntity>,
  ) {}

  async create(
    data: CreateVehicleMissionStatus,
  ): Promise<VehicleMissionStatus> {
    data.timestamp = data?.timestamp || DateTime.utc().toJSDate();
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    const { _id: _, ...response } = saved;
    return response;
  }

  async findByIds(ids: string[]): Promise<VehicleMissionStatus[]> {
    const entities = await this.repository.find({
      where: { vehicleMissionId: { $in: ids } },
    });

    if (!entities) return [];

    return entities.map((entity) => {
      const { _id: _, ...response } = entity;
      return response;
    });
  }

  async findAll() {
    const entities = await this.repository.find();

    if (!entities) return [];

    return entities.map((entity) => {
      const { _id: _, ...response } = entity;
      return response;
    });
  }

  async findById(vehicleMissionId: string) {
    const entity = await this.repository.findOneBy({ vehicleMissionId });

    if (!entity) return null;

    const { _id: _, ...response } = entity;
    return response;
  }
}
