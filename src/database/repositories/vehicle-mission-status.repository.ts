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
}
