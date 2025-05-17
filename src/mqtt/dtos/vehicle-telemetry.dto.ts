import { VehicleTelemetry, VehicleLocation } from '@autonomous/shared/types';

export class VehicleTelemetryDto implements VehicleTelemetry {
  location: VehicleLocation;
  status: string;
  timestamp: Date;
  vehicleId: string;
}
