export interface Location {
  coordinates: [number, number];
  type: 'Point';
}

export interface VehicleTelemetry {
  location: Location;
  status: string;
  timestamp: Date;
  vehicleId: string;
}
