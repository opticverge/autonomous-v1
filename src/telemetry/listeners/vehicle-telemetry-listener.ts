import { Injectable, Logger } from '@nestjs/common';
import { TelemetryService } from '@autonomous/telemetry/telemetry.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTopic, VehicleTelemetry } from '@autonomous/shared/types';

@Injectable()
export class VehicleTelemetryListener {
  private readonly logger = new Logger(VehicleTelemetryListener.name);
  public constructor(private readonly telemetryService: TelemetryService) {}

  @OnEvent(EventTopic.VEHICLE_TELEMETRY)
  async handleVehicleTelemetryEvent(payload: VehicleTelemetry) {
    try {
      this.logger.log(
        `Received vehicle telemetry event for vehicle:${payload.vehicleId}`,
      );

      await this.telemetryService.process(payload);
    } catch (error) {
      this.logger.error('Error while processing vehicle telemetry event', {
        error: error instanceof Error ? error : JSON.stringify(error),
        payload,
      });
    }
  }
}
