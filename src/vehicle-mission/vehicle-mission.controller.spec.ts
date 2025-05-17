import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionController } from './vehicle-mission.controller';

describe('VehicleMissionController', () => {
  let controller: VehicleMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleMissionController],
    }).compile();

    controller = module.get<VehicleMissionController>(VehicleMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
