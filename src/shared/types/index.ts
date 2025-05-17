import {
  MissionEntity,
  VehicleMissionEntity,
  VehicleMissionStatusEntity,
  TelemetryEntity,
  VehicleEntity,
} from '@autonomous/database/entities';
import { Location } from '@autonomous/database/entities/location';

export type Vehicle = Pick<
  VehicleEntity,
  'vehicleId' | 'name' | 'createdAt' | 'updatedAt'
>;

export type CreateVehicle = Pick<VehicleEntity, 'name'>;

export type UpdateVehicle = CreateVehicle;

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

export type MessagePayload =
  | VehicleMissionStatusResponse
  | VehicleTelemetry
  | VehicleMissionResponse;

export type BaseMessage<T extends Topic, P extends MessagePayload> = {
  topic: T;
  payload: P;
};

export type VehicleTelemetryEvent = BaseMessage<
  Topic.VEHICLE_TELEMETRY,
  VehicleTelemetry
>;

export type VehicleMissionEvent = BaseMessage<
  Topic.VEHICLE_MISSION,
  VehicleMissionStatusResponse
>;

export type VehicleMissionStatusEvent = BaseMessage<
  Topic.VEHICLE_MISSION_STATUS,
  VehicleMissionResponse
>;

export type AppEvent =
  | VehicleMissionEvent
  | VehicleTelemetryEvent
  | VehicleMissionStatusEvent;

export type AppEventTopic = AppEvent['topic'];

export type EventPayload<T extends AppEventTopic> = Extract<
  AppEvent,
  { topic: T }
>['payload'];
