import { Injectable } from '@nestjs/common';
import {
  VehicleMissionStatusResponse,
  CreateVehicleMission,
} from '@autonomous/shared/types';
import {
  VehicleMissionRepository,
  VehicleMissionStatusRepository,
} from '@autonomous/database/repositories';
import { MissionStatus } from '@autonomous/database/entities';

@Injectable()
export class VehicleMissionService {
  constructor(
    private readonly vehicleMissionRepository: VehicleMissionRepository,
    private readonly vehicleMissionStatusRepository: VehicleMissionStatusRepository,
  ) {}

  async create(
    request: CreateVehicleMission,
  ): Promise<VehicleMissionStatusResponse> {
    const entity = await this.vehicleMissionRepository.create(request);

    const statusEntity = await this.vehicleMissionStatusRepository.create({
      vehicleMissionId: entity.vehicleMissionId,
      status: MissionStatus.PENDING,
    });

    return { ...entity, ...statusEntity };
  }
}
