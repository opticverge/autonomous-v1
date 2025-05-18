import { Injectable, NotFoundException } from '@nestjs/common';
import {
  VehicleMissionStatusResponse,
  CreateVehicleMission,
  VehicleMission,
} from '@autonomous/shared/types';
import {
  VehicleMissionRepository,
  VehicleMissionStatusRepository,
  VehicleRepository,
  MissionRepository,
} from '@autonomous/database/repositories';
import { MissionStatus } from '@autonomous/database/entities';
import { Nullable } from '@autonomous/common/types';

@Injectable()
export class VehicleMissionService {
  constructor(
    private readonly vehicleMissionRepository: VehicleMissionRepository,
    private readonly vehicleMissionStatusRepository: VehicleMissionStatusRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly missionRepository: MissionRepository,
  ) {}

  async create(
    request: CreateVehicleMission,
  ): Promise<VehicleMissionStatusResponse> {
    const [vehicle, mission] = await Promise.all([
      this.vehicleRepository.findById(request.vehicleId),
      this.missionRepository.findById(request.missionId),
    ]);

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with id ${request.vehicleId} not found`,
      );
    }

    if (!mission) {
      throw new NotFoundException(
        `Mission with id ${request.missionId} not found`,
      );
    }

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
