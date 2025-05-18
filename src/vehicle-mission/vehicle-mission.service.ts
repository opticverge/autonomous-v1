import { Injectable, NotFoundException } from '@nestjs/common';
import {
  VehicleMissionStatusResponse,
  CreateVehicleMission,
  VehicleMission,
} from '@autonomous/shared/types';
import {
  VehicleMissionRepository,
  VehicleMissionStatusRepository,
} from '@autonomous/database/repositories';
import { MissionStatus } from '@autonomous/database/entities';
import { Nullable } from '@autonomous/common/types';

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

  async findAll(): Promise<VehicleMission[]> {
    return this.vehicleMissionRepository.findAll();
  }

  async findById(id: string): Promise<Nullable<VehicleMission>> {
    const result = await this.vehicleMissionRepository.findById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
