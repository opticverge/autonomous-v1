import { Injectable, Logger } from '@nestjs/common';
import {
  TelemetryRepository,
  VehicleRepository,
} from '@autonomous/database/repositories';
import { VehicleTelemetry } from '@autonomous/shared/types';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly telemetryRepository: TelemetryRepository,
  ) {}

  async process(telemetry: VehicleTelemetry): Promise<void> {
    if (telemetry?.vehicleId == null) {
      this.logger.error(
        `Vehicle ID is missing in telemetry data, telemetry not processed for ${JSON.stringify(telemetry)}`,
      );
      return;
    }

    const vehicle = await this.vehicleRepository.findById(telemetry.vehicleId);

    if (vehicle == null) {
      this.logger.error(
        `Vehicle not found, telemetry not processed for ${JSON.stringify(telemetry)}`,
      );
      return;
    }

    await this.telemetryRepository.create(telemetry);

    this.logger.log(
      `Telemetry data processed for vehicle:${telemetry.vehicleId}`,
    );
  }
}
