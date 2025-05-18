import { Injectable } from '@nestjs/common';

import {
  MissionRepository,
  VehicleMissionRepository,
  VehicleMissionStatusRepository,
  VehicleRepository,
} from '@autonomous/database/repositories';
import { MissionReport } from '@autonomous/shared/types';

@Injectable()
export class ReportsService {
  constructor(
    private readonly vehicleMissionRepository: VehicleMissionRepository,
    private readonly vehicleMissionStatusRepository: VehicleMissionStatusRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly missionRepository: MissionRepository,
  ) {}

  async getMissionReports(): Promise<MissionReport[]> {
    const vehicleMissions = await this.vehicleMissionRepository.findAll();

    if (vehicleMissions.length === 0) {
      return [];
    }

    const vehicleMissionIds = vehicleMissions.map((vm) => vm.vehicleMissionId);

    const vehicleIds = Array.from(
      new Set(vehicleMissions.map((vm) => vm.vehicleId)),
    );

    const missionIds = Array.from(
      new Set(vehicleMissions.map((vm) => vm.missionId)),
    );

    const [statuses, vehicles, missions] = await Promise.all([
      this.vehicleMissionStatusRepository.findByIds(vehicleMissionIds),
      this.vehicleRepository.findByIds(vehicleIds),
      this.missionRepository.findByIds(missionIds),
    ]);

    const vehicleMap = new Map(
      vehicles.map((vehicle) => [vehicle.vehicleId, vehicle]),
    );
    const missionMap = new Map(
      missions.map((mission) => [mission.missionId, mission]),
    );

    const reports: MissionReport[] = [];

    for (const vehicleMission of vehicleMissions) {
      const missionStatuses = statuses.filter(
        (status) => status.vehicleMissionId === vehicleMission.vehicleMissionId,
      );
      const vehicle = vehicleMap.get(vehicleMission.vehicleId)!;
      const mission = missionMap.get(vehicleMission.missionId)!;

      reports.push({
        mission: mission,
        vehicle: vehicle,
        statuses: missionStatuses,
      });
    }

    return reports;
  }
}
