import { Injectable, Logger } from '@nestjs/common';
import { TelemetryService } from '@autonomous/telemetry/telemetry.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Topic, VehicleTelemetry } from '@autonomous/shared/types';

@Injectable()
export class VehicleTelemetryListener {
  private readonly logger = new Logger(VehicleTelemetryListener.name);
  public constructor(private readonly telemetryService: TelemetryService) {}

  @OnEvent(Topic.VEHICLE_TELEMETRY)
  async handleVehicleTelemetryEvent(payload: VehicleTelemetry) {
    try {
      await this.telemetryService.process(payload);
    } catch (error) {
      this.logger.error('Error while handling vehicle telemetry event', {
        error: error instanceof Error ? error : JSON.stringify(error),
        payload,
      });
    }
  }
}
