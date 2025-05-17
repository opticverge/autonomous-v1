import {
  MissionEntity,
  VehicleMissionEntity,
  VehicleMissionStatusEntity,
  TelemetryEntity,
} from '@autonomous/database/entities';

export type CreateMissionRequest = Pick<
  MissionEntity,
  'missionId' | 'description' | 'name'
>;

export type CreateMissionResponse = Pick<
  MissionEntity,
  'missionId' | 'description' | 'createdAt' | 'updatedAt'
>;

export type VehicleMission = Pick<
  VehicleMissionEntity,
  'vehicleMissionId' | 'vehicleId' | 'missionId'
>;

export type CreateVehicleMissionRequest = VehicleMission;

export type CreateVehicleMissionResponse = Pick<
  VehicleMissionEntity,
  'missionId' | 'vehicleMissionId' | 'vehicleId' | 'createdAt' | 'updatedAt'
> &
  Pick<VehicleMissionStatusEntity, 'status' | 'timestamp'>;

export type VehicleMissionStatus = Pick<
  VehicleMissionStatusEntity,
  'vehicleMissionId' | 'status'
> &
  Pick<Partial<VehicleMissionStatusEntity>, 'timestamp'>;

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
  | CreateVehicleMissionResponse
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
  CreateVehicleMissionResponse
>;

export type VehicleMissionStatusEvent = BaseMqttMessage<
  Topic.VEHICLE_MISSION_STATUS,
  VehicleMissionResponse
>;

export type MqttEvent =
  | VehicleMissionEvent
  | VehicleTelemetryEvent
  | VehicleMissionStatusEvent;
