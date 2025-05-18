import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleEntity } from '@autonomous/database/entities';
import { MongoRepository } from 'typeorm';
import { Nullable } from '@autonomous/common/types';
import {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from '@autonomous/shared/types';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly repository: MongoRepository<VehicleEntity>,
  ) {}

  async create(data: CreateVehicle): Promise<Vehicle> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    const { _id, ...response } = saved;
    return response;
  }

  async find(vehicleId: string): Promise<Nullable<Vehicle>> {
    const entity = await this.repository.findOne({
      where: { vehicleId },
    });

    if (entity == null) {
      return null;
    }

    const { _id: _, ...response } = entity;

    return response;
  }

  async findAll(): Promise<Vehicle[]> {
    const entities = await this.repository.find();
    if (entities == null) {
      return [];
    }
    return entities.map((entity) => {
      const { _id: _, ...response } = entity;
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

  async update(vehicleId: string, data: UpdateVehicle): Promise<void> {
    await this.repository.update({ vehicleId }, data);
  }
}
