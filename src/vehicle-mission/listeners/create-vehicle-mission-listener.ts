import { Injectable, Logger } from '@nestjs/common';
import { MissionStatus } from '@autonomous/database/entities';
import {
  EventTopic,
  VehicleMissionStatusResponse,
} from '@autonomous/shared/types';
import { OnEvent } from '@nestjs/event-emitter';
import { MqttPublisherService } from '@autonomous/messaging';
import { VehicleMissionStatusService } from '@autonomous/vehicle-mission/vehicle-mission-status.service';

@Injectable()
export class CreateVehicleMissionListener {
  private readonly logger = new Logger(CreateVehicleMissionListener.name);

  constructor(
    private readonly publisher: MqttPublisherService,
    private readonly vehicleMissionStatusService: VehicleMissionStatusService,
  ) {}

  @OnEvent(EventTopic.CREATE_VEHICLE_MISSION)
  public async handleCreateVehicleMissionEvent(
    payload: VehicleMissionStatusResponse,
  ): Promise<void> {
    try {
      this.logger.log(
        `Processing ${EventTopic.CREATE_VEHICLE_MISSION} event for vehicle:${payload.vehicleId}`,
      );

      // Update the vehicle mission state to QUEUED since it is being sent to the vehicle
      const latestMission = await this.vehicleMissionStatusService.create({
        vehicleMissionId: payload.vehicleMissionId,
        status: MissionStatus.QUEUED,
      });

      this.logger.log(
        `Added vehicle mission to the queue for vehicle:${payload.vehicleId} vehicleMission:${payload.vehicleMissionId}`,
      );

      // Publish the vehicle mission to the target vehicle
      await this.publisher.publish(`vehicle/${payload.vehicleId}/mission`, {
        ...payload,
        ...latestMission,
      });

      this.logger.log(
        `Published vehicle mission to vehicle:${payload.vehicleId} vehicleMission:${payload.vehicleMissionId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error while processing ${EventTopic.CREATE_VEHICLE_MISSION} event`,
        {
          error: error instanceof Error ? error : JSON.stringify(error),
          payload,
        },
      );
    }
  }
}
