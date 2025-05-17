import { Injectable } from '@nestjs/common';
import { VehicleMissionStatusRepository } from '@autonomous/database/repositories';
import { VehicleMissionStatus } from '@autonomous/shared/types';

@Injectable()
export class VehicleMissionStatusService {
  constructor(private readonly repository: VehicleMissionStatusRepository) {}

  async create(data: VehicleMissionStatus) {
    return await this.repository.create(data);
  }
}
