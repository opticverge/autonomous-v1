export * from '@autonomous/database/entities/vehicle.entity';
export * from '@autonomous/database/entities/mission.entity';
export * from '@autonomous/database/entities/telemetry.entity';
export * from '@autonomous/database/entities/vehicle-mission.entity';
export * from '@autonomous/database/entities/vehicle-mission-status.entity';

export type Location = {
  coordinates: [number, number];
  type: 'Point';
};

export enum MissionStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
