import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTopic, VehicleMissionResponse } from '@autonomous/shared/types';
import { VehicleMissionStatusService } from '@autonomous/vehicle-mission/vehicle-mission-status.service';

@Injectable()
export class VehicleMissionStatusListener {
  private readonly logger = new Logger(VehicleMissionStatusListener.name);

  constructor(
    private readonly vehicleMissionStatusService: VehicleMissionStatusService,
  ) {}

  @OnEvent(EventTopic.VEHICLE_MISSION_STATUS)
  async handleVehicleMissionStatusEvent(payload: VehicleMissionResponse) {
    try {
      this.logger.log(
        `Processing ${EventTopic.VEHICLE_MISSION_STATUS} event for vehicle:${payload.vehicleId}`,
      );
      await this.vehicleMissionStatusService.create(payload);
    } catch (error) {
      this.logger.error('Error while handling vehicle mission status event', {
        error: error instanceof Error ? error : JSON.stringify(error),
        payload,
      });
    }
  }
}
