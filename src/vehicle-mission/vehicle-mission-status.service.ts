import { Injectable } from '@nestjs/common';
import { VehicleMissionStatusRepository } from '@autonomous/database/repositories';
import { CreateVehicleMissionStatus } from '@autonomous/shared/types';

@Injectable()
export class VehicleMissionStatusService {
  constructor(private readonly repository: VehicleMissionStatusRepository) {}

  async create(data: CreateVehicleMissionStatus) {
    return await this.repository.create(data);
  }
}
