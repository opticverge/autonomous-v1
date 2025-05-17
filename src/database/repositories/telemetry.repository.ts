import { Injectable } from '@nestjs/common';
import { TelemetryEntity } from '@autonomous/database/entities';
import { VehicleTelemetry } from '@autonomous/shared/types';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TelemetryRepository {
  constructor(
    @InjectRepository(TelemetryEntity)
    private readonly repository: MongoRepository<TelemetryEntity>,
  ) {}

  async create(data: VehicleTelemetry): Promise<TelemetryEntity> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
}
