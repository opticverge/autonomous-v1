import {
  MissionEntity,
  VehicleMissionEntity,
  VehicleMissionStatusEntity,
  TelemetryEntity,
  Location,
} from '@autonomous/database/entities';

export type VehicleLocation = Location;

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

export type CreateVehicleMissionStatusRequest = VehicleMissionStatus;

export type CreateVehicleMissionStatusResponse = Pick<
  VehicleMissionStatusEntity,
  'vehicleMissionId' | 'status' | 'timestamp'
>;

export type VehicleTelemetry = Pick<
  TelemetryEntity,
  'vehicleId' | 'status' | 'timestamp' | 'location'
>;

export type VehicleMissionResponse = Pick<
  VehicleMissionEntity & VehicleMissionStatusEntity,
  'vehicleMissionId' | 'timestamp' | 'status'
>;

export enum Topic {
  VEHICLE_MISSION = 'vehicle/mission',
  VEHICLE_TELEMETRY = 'vehicle/telemetry',
  VEHICLE_MISSION_STATUS = 'vehicle/mission/status',
}

export type MqttPayload =
  | VehicleMissionStatusResponse
  | VehicleTelemetry
  | VehicleMissionResponse;

export type BaseMqttMessage<T extends Topic, P extends MqttPayload> = {
  topic: T;
  payload: P;
};

export type VehicleTelemetryEvent = BaseMqttMessage<
  Topic.VEHICLE_TELEMETRY,
  VehicleTelemetry
>;

export type VehicleMissionEvent = BaseMqttMessage<
  Topic.VEHICLE_MISSION,
  VehicleMissionStatusResponse
>;

export type VehicleMissionStatusEvent = BaseMqttMessage<
  Topic.VEHICLE_MISSION_STATUS,
  VehicleMissionResponse
>;

export type MqttEvent =
  | VehicleMissionEvent
  | VehicleTelemetryEvent
  | VehicleMissionStatusEvent;
