import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionStatusService } from './vehicle-mission-status.service';
import { VehicleMissionStatusRepository } from '@autonomous/database/repositories';
import {
  CreateVehicleMissionStatus,
  VehicleMissionStatus,
} from '@autonomous/shared/types';
import { MissionStatus } from '@autonomous/database/entities';

describe('VehicleMissionStatusService', () => {
  let service: VehicleMissionStatusService;
  let mockRepository: { create: jest.Mock };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMissionStatusService,
        {
          provide: VehicleMissionStatusRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VehicleMissionStatusService>(
      VehicleMissionStatusService,
    );

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle mission status', async () => {
      const createDto: CreateVehicleMissionStatus = {
        vehicleMissionId: 'vm-id',
        status: MissionStatus.PENDING,
      };

      const expectedResult: VehicleMissionStatus = {
        vehicleMissionId: 'vm-id',
        status: MissionStatus.PENDING,
        timestamp: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from the repository', async () => {
      const createDto: CreateVehicleMissionStatus = {
        vehicleMissionId: 'vm-id',
        status: MissionStatus.PENDING,
      };

      const error = new Error('Repository error');
      mockRepository.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });
  });
});
