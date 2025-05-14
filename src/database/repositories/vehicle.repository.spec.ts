import { Test, TestingModule } from '@nestjs/testing';
import { VehicleRepository } from './vehicle.repository';

describe('VehicleRepositoryService', () => {
  let service: VehicleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleRepository],
    }).compile();

    service = module.get<VehicleRepository>(VehicleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
