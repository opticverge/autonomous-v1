import { Injectable } from '@nestjs/common';
import { TelemetryEntity } from '@autonomous/database/entities';
import { Telemetry, VehicleTelemetry } from '@autonomous/shared/types';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TelemetryRepository {
  constructor(
    @InjectRepository(TelemetryEntity)
    private readonly repository: MongoRepository<TelemetryEntity>,
  ) {}

  async create(data: VehicleTelemetry): Promise<Telemetry> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    const { _id: _, ...response } = saved;
    return response;
  }
}
