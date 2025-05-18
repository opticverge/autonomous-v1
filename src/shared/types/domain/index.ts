import {
  MissionEntity,
  VehicleMissionEntity,
  VehicleMissionStatusEntity,
  TelemetryEntity,
  VehicleEntity,
} from '@autonomous/database/entities';

export type Vehicle = Pick<
  VehicleEntity,
  'vehicleId' | 'name' | 'createdAt' | 'updatedAt'
>;

export type CreateVehicle = Pick<VehicleEntity, 'name'>;

export type UpdateVehicle = CreateVehicle;

export type Telemetry = Pick<
  TelemetryEntity,
  'vehicleId' | 'status' | 'timestamp' | 'location'
>;

export type CreateMission = Pick<
  MissionEntity,
  'missionId' | 'description' | 'name'
>;

export type Mission = Pick<
  MissionEntity,
  'missionId' | 'name' | 'description' | 'createdAt' | 'updatedAt'
>;

export type CreateVehicleMission = Pick<
  VehicleMissionEntity,
  'vehicleMissionId' | 'vehicleId' | 'missionId'
>;

export type VehicleMission = Pick<
  VehicleMissionEntity,
  'vehicleMissionId' | 'vehicleId' | 'missionId' | 'createdAt' | 'updatedAt'
>;

export type VehicleMissionStatusResponse = Pick<
  VehicleMissionEntity,
  'missionId' | 'vehicleMissionId' | 'vehicleId' | 'createdAt' | 'updatedAt'
> &
  Pick<VehicleMissionStatusEntity, 'status' | 'timestamp'>;

export type VehicleMissionStatus = Pick<
  VehicleMissionStatusEntity,
  'vehicleMissionId' | 'status' | 'timestamp'
>;

export type CreateVehicleMissionStatus = Pick<
  VehicleMissionStatus,
  'status' | 'vehicleMissionId'
> &
  Pick<Partial<VehicleMissionStatus>, 'timestamp'>;

export type VehicleTelemetry = Pick<
  TelemetryEntity,
  'vehicleId' | 'status' | 'timestamp' | 'location'
>;

export type VehicleMissionResponse = Pick<
  VehicleMissionEntity & VehicleMissionStatusEntity,
  'vehicleMissionId' | 'timestamp' | 'status' | 'vehicleId'
>;

export type MissionReport = {
  vehicle: Vehicle;
  mission: Mission;
  statuses: VehicleMissionStatus[];
};
