import { Injectable, Logger } from '@nestjs/common';
import { TelemetryRepository } from '@autonomous/database/repositories';
import { VehicleTelemetry } from '@autonomous/shared/types';
import { VehicleService } from '@autonomous/vehicle/vehicle.service';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    private readonly vehicleService: VehicleService,
    private readonly telemetryRepository: TelemetryRepository,
  ) {}

  async findByVehicleId(vehicleId: string): Promise<VehicleTelemetry[]> {
    await this.vehicleService.find(vehicleId);
    return await this.telemetryRepository.findByVehicleId(vehicleId);
  }

  async process(telemetry: VehicleTelemetry): Promise<void> {
    if (telemetry?.vehicleId == null) {
      this.logger.error(
        `Vehicle ID is missing in telemetry data, telemetry not processed for ${JSON.stringify(telemetry)}`,
      );
      return;
    }

    try {
      await this.vehicleService.find(telemetry.vehicleId);
    } catch {
      this.logger.error(
        `Vehicle not found for telemetry data, telemetry not processed for vehicle:${telemetry?.vehicleId} payload:${JSON.stringify(telemetry)}`,
      );
      return;
    }

    await this.telemetryRepository.create(telemetry);

    this.logger.log(
      `Telemetry data processed for vehicle:${telemetry.vehicleId}`,
    );
  }
}
