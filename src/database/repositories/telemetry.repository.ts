import { Injectable } from '@nestjs/common';
import { Telemetry } from '@autonomous/database/entities';
import { VehicleTelemetry } from '@autonomous/mqtt/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TelemetryRepository {
  constructor(
    @InjectRepository(Telemetry)
    private readonly repository: Repository<Telemetry>,
  ) {}

  async create(telemetry: VehicleTelemetry): Promise<Telemetry> {
    const entity = new Telemetry();
    entity.vehicleId = telemetry.vehicleId;
    entity.timestamp = telemetry.timestamp;
    entity.location = telemetry.location;

    return await this.repository.save(entity);
  }
}
