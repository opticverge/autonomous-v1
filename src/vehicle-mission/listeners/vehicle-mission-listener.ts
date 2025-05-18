import {
  EventTopic,
  VehicleMissionStatusResponse,
  VehicleMissionStatusTopic,
} from '@autonomous/shared/types';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MqttPublisherService } from '@autonomous/messaging';
import { MissionStatus } from '@autonomous/database/entities';
import { DateTime } from 'luxon';

@Injectable()
export class VehicleMissionListener {
  private readonly logger = new Logger(VehicleMissionListener.name);

  constructor(private readonly publisherService: MqttPublisherService) {}

  @OnEvent(EventTopic.VEHICLE_MISSION)
  async handleSimulatedVehicleMissionEvent(
    payload: VehicleMissionStatusResponse,
  ) {
    try {
      this.logger.log(
        `Vehicle received mission from MQTT vehicleId:${payload.vehicleId} mission:${payload.missionId}`,
      );

      this.logger.log(
        `Vehicle sending mission status to MQTT vehicleId:${payload.vehicleId} status:${MissionStatus.IN_PROGRESS}`,
      );

      // simulate the vehicle picking up the message from the queue and updating it's state
      await this.publisherService.publish<VehicleMissionStatusTopic>(
        `vehicle/${payload.vehicleId}/mission/status`,
        {
          vehicleId: payload.vehicleId,
          vehicleMissionId: payload.vehicleMissionId,
          status: MissionStatus.IN_PROGRESS,
          timestamp: DateTime.utc().toJSDate(),
        },
      );

      this.logger.log(
        `Vehicle executing mission vehicleId:${payload.vehicleId} vehicleMission:${payload.vehicleMissionId}`,
      );

      // add wait time to simulate the mission in progress
      await new Promise((resolve) => setTimeout(resolve, 5000));

      this.logger.log(
        `Vehicle executed mission vehicleId:${payload.vehicleId} vehicleMission:${payload.vehicleMissionId}`,
      );

      // Simulate the mission succeeding 95% of the time
      const missionStatus =
        Math.random() < 0.95 ? MissionStatus.COMPLETED : MissionStatus.FAILED;

      await this.publisherService.publish<VehicleMissionStatusTopic>(
        `vehicle/${payload.vehicleId}/mission/status`,
        {
          vehicleId: payload.vehicleId,
          vehicleMissionId: payload.vehicleMissionId,
          status: missionStatus,
          timestamp: DateTime.utc().toJSDate(),
        },
      );

      this.logger.log(
        `Vehicle sent mission update to MQTT vehicleId:${payload.vehicleId} status:${missionStatus}`,
      );
    } catch (error) {
      this.logger.error(
        'Error while handling simulated vehicle mission status update',
        {
          error: error instanceof Error ? error : JSON.stringify(error),
          payload,
        },
      );
    }
  }
}
