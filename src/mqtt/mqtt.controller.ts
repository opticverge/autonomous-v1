import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  EventTopic,
  VehicleMissionResponse,
  VehicleMissionStatusResponse,
  VehicleMissionStatusTopic,
  VehicleMissionTopic,
  VehicleTelemetry,
  VehicleTelemetryTopic,
} from '@autonomous/shared/types';
import { EventService } from '@autonomous/event/event.service';

@Controller()
export class MqttController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern<VehicleTelemetryTopic>('vehicle/+/telemetry')
  vehicleTelemetryHandler(@Payload() payload: VehicleTelemetry) {
    this.eventService.emit(EventTopic.VEHICLE_TELEMETRY, payload);
  }

  @MessagePattern<VehicleMissionTopic>('vehicle/+/mission')
  vehicleMissionSimulationHandler(
    @Payload() payload: VehicleMissionStatusResponse,
  ) {
    this.eventService.emit(EventTopic.VEHICLE_MISSION, payload);
  }

  @MessagePattern<VehicleMissionStatusTopic>('vehicle/+/mission/status')
  vehicleMissionResponseHandler(@Payload() payload: VehicleMissionResponse) {
    this.eventService.emit(EventTopic.VEHICLE_MISSION_STATUS, payload);
  }
}
