import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionStatusListener } from './vehicle-mission-status-listener';

describe('VehicleMissionStatusListenerService', () => {
  let service: VehicleMissionStatusListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleMissionStatusListener],
    }).compile();

    service = module.get<VehicleMissionStatusListener>(VehicleMissionStatusListener);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
