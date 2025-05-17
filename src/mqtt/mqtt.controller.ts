import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  Topic,
  VehicleMissionResponse,
  VehicleTelemetry,
} from '@autonomous/shared/types';
import { EventService } from '@autonomous/event/event.service';

@Controller()
export class MqttController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern(Topic.VEHICLE_TELEMETRY)
  vehicleTelemetryHandler(@Payload() payload: VehicleTelemetry) {
    this.eventService.emit(Topic.VEHICLE_TELEMETRY, payload);
  }

  @MessagePattern(Topic.VEHICLE_MISSION_STATUS)
  vehicleMissionResponseHandler(@Payload() payload: VehicleMissionResponse) {
    this.eventService.emit(Topic.VEHICLE_MISSION_STATUS, payload);
  }
}
