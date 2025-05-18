import { Module } from '@nestjs/common';
import { TelemetryService } from '@autonomous/telemetry/telemetry.service';
import { VehicleTelemetryListener } from './listeners/vehicle-telemetry-listener';
import { VehicleModule } from '@autonomous/vehicle/vehicle.module';
import { DatabaseModule } from '@autonomous/database/database.module';
import { TelemetryController } from './telemetry.controller';

@Module({
  imports: [DatabaseModule, VehicleModule],
  providers: [TelemetryService, VehicleTelemetryListener],
  controllers: [TelemetryController],
})
export class TelemetryModule {}
