import {
  VehicleMissionResponse,
  VehicleMissionStatusResponse,
  VehicleTelemetry,
} from '../domain';

export enum EventTopic {
  CREATE_VEHICLE_MISSION = 'create.vehicle.mission',
  VEHICLE_MISSION = 'vehicle.mission',
  VEHICLE_TELEMETRY = 'vehicle.telemetry',
  VEHICLE_MISSION_STATUS = 'vehicle.mission.status',
}

export type EventPayload =
  | VehicleMissionStatusResponse
  | VehicleTelemetry
  | VehicleMissionResponse;

export type BaseEvent<T extends EventTopic, P extends EventPayload> = {
  topic: T;
  payload: P;
};

export type VehicleTelemetryEvent = BaseEvent<
  EventTopic.VEHICLE_TELEMETRY,
  VehicleTelemetry
>;

export type VehicleMissionEvent = BaseEvent<
  EventTopic.VEHICLE_MISSION,
  VehicleMissionStatusResponse
>;

export type CreateVehicleMissionEvent = BaseEvent<
  EventTopic.CREATE_VEHICLE_MISSION,
  VehicleMissionStatusResponse
>;

export type VehicleMissionStatusEvent = BaseEvent<
  EventTopic.VEHICLE_MISSION_STATUS,
  VehicleMissionResponse
>;

export type AppEvent =
  | VehicleMissionEvent
  | VehicleTelemetryEvent
  | VehicleMissionStatusEvent
  | CreateVehicleMissionEvent;

export type AppEventTopic = AppEvent['topic'];

export type AppEventPayload<T extends AppEventTopic> = Extract<
  AppEvent,
  { topic: T }
>['payload'];
