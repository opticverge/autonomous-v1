import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTelemetryListener } from './vehicle-telemetry-listener';

describe('VehicleTelemetryListenerService', () => {
  let service: VehicleTelemetryListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleTelemetryListener],
    }).compile();

    service = module.get<VehicleTelemetryListener>(VehicleTelemetryListener);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
