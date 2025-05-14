import { Location, VehicleTelemetry } from '@autonomous/mqtt/types';

export class VehicleTelemetryDto implements VehicleTelemetry {
  location: Location;
  status: string;
  timestamp: Date;
  vehicleId: string;
}
