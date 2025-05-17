import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionService } from './vehicle-mission.service';

describe('VehicleMissionService', () => {
  let service: VehicleMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleMissionService],
    }).compile();

    service = module.get<VehicleMissionService>(VehicleMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
