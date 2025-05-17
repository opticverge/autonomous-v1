import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelemetryService } from '@autonomous/mqtt/services';
import { VehicleTelemetryDto } from 'src/mqtt/dtos';
import { Topic, VehicleMissionResponse } from '@autonomous/shared/types';
import { VehicleMissionStatusService } from '@autonomous/vehicle-mission/vehicle-mission-status.service';

@Controller()
export class MqttController {
  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly vehicleMissionStatusService: VehicleMissionStatusService,
  ) {}

  @MessagePattern(Topic.VEHICLE_TELEMETRY)
  async handleVehicleTelemetry(@Payload() payload: VehicleTelemetryDto) {
    await this.telemetryService.process(payload);
  }

  @MessagePattern(Topic.VEHICLE_MISSION_STATUS)
  async handleVehicleMissionResponse(
    @Payload() payload: VehicleMissionResponse,
  ) {
    await this.vehicleMissionStatusService.create(payload);
  }
}
