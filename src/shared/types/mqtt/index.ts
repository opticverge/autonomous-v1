import {
  VehicleMissionResponse,
  VehicleMissionStatusResponse,
  VehicleTelemetry,
} from '../domain';

type Segment = Exclude<string, `${string}/${string}`>;

export type VehicleMissionTopic = `vehicle/${Segment}/mission`;
export type VehicleTelemetryTopic = `vehicle/${Segment}/telemetry`;
export type VehicleMissionStatusTopic = `vehicle/${Segment}/mission/status`;

export type MqttTopic =
  | VehicleMissionTopic
  | VehicleTelemetryTopic
  | VehicleMissionStatusTopic;

export type MqttPayload =
  | VehicleMissionStatusResponse
  | VehicleTelemetry
  | VehicleMissionResponse;

export type BaseMqttMessage<T extends MqttTopic, P extends MqttPayload> = {
  topic: T;
  payload: P;
};

export type VehicleTelemetryMessage = BaseMqttMessage<
  VehicleTelemetryTopic,
  VehicleTelemetry
>;

export type VehicleMissionMessage = BaseMqttMessage<
  VehicleMissionTopic,
  VehicleMissionStatusResponse
>;

export type VehicleMissionStatusMessage = BaseMqttMessage<
  VehicleMissionStatusTopic,
  VehicleMissionResponse
>;

export type MqttMessage =
  | VehicleMissionMessage
  | VehicleTelemetryMessage
  | VehicleMissionStatusMessage;

export type MqttMessageTopic = MqttMessage['topic'];

export type MqttMessagePayload<T extends MqttMessageTopic> = Extract<
  MqttMessage,
  { topic: T }
>['payload'];
