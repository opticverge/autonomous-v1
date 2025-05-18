import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import {
  MissionRepository,
  VehicleMissionRepository,
  VehicleMissionStatusRepository,
  VehicleRepository,
} from '@autonomous/database/repositories';
import { MissionStatus } from '@autonomous/database/entities';
import {
  VehicleMission,
  Vehicle,
  Mission,
  VehicleMissionStatus,
} from '@autonomous/shared/types';

describe('ReportsService', () => {
  let service: ReportsService;
  let vehicleMissionRepository: jest.Mocked<VehicleMissionRepository>;
  let vehicleMissionStatusRepository: jest.Mocked<VehicleMissionStatusRepository>;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let missionRepository: jest.Mocked<MissionRepository>;

  beforeEach(async () => {
    const mockVehicleMissionRepository = {
      findAll: jest.fn(),
    };
    const mockVehicleMissionStatusRepository = {
      findByIds: jest.fn(),
    };
    const mockVehicleRepository = {
      findByIds: jest.fn(),
    };
    const mockMissionRepository = {
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: VehicleMissionRepository,
          useValue: mockVehicleMissionRepository,
        },
        {
          provide: VehicleMissionStatusRepository,
          useValue: mockVehicleMissionStatusRepository,
        },
        {
          provide: VehicleRepository,
          useValue: mockVehicleRepository,
        },
        {
          provide: MissionRepository,
          useValue: mockMissionRepository,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    vehicleMissionRepository = module.get(VehicleMissionRepository);
    vehicleMissionStatusRepository = module.get(VehicleMissionStatusRepository);
    vehicleRepository = module.get(VehicleRepository);
    missionRepository = module.get(MissionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have all dependencies injected', () => {
    expect(vehicleMissionRepository).toBeDefined();
    expect(vehicleMissionStatusRepository).toBeDefined();
    expect(vehicleRepository).toBeDefined();
    expect(missionRepository).toBeDefined();
  });

  describe('getMissionReports', () => {
    it('should return an empty array when no vehicle missions are found', async () => {
      // Arrange
      vehicleMissionRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.getMissionReports();

      // Assert
      expect(result).toEqual([]);
      expect(vehicleMissionRepository.findAll).toHaveBeenCalledTimes(1);
      expect(vehicleMissionStatusRepository.findByIds).not.toHaveBeenCalled();
      expect(vehicleRepository.findByIds).not.toHaveBeenCalled();
      expect(missionRepository.findByIds).not.toHaveBeenCalled();
    });

    it('should return mission reports with correct data when vehicle missions are found', async () => {
      // Arrange
      const vehicleMissionId = 'vm-123';
      const vehicleId = 'v-123';
      const missionId = 'm-123';

      const mockVehicleMission: VehicleMission = {
        vehicleMissionId,
        vehicleId,
        missionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockVehicleMissionStatus: VehicleMissionStatus = {
        vehicleMissionId,
        status: MissionStatus.PENDING,
        timestamp: new Date(),
      };

      const mockVehicle: Vehicle = {
        vehicleId,
        name: 'Test Vehicle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMission: Mission = {
        missionId,
        name: 'Test Mission',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vehicleMissionRepository.findAll.mockResolvedValue([mockVehicleMission]);
      vehicleMissionStatusRepository.findByIds.mockResolvedValue([
        mockVehicleMissionStatus,
      ]);
      vehicleRepository.findByIds.mockResolvedValue([mockVehicle]);
      missionRepository.findByIds.mockResolvedValue([mockMission]);

      // Act
      const result = await service.getMissionReports();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].vehicle).toEqual(mockVehicle);
      expect(result[0].mission).toEqual(mockMission);
      expect(result[0].statuses).toHaveLength(1);
      expect(result[0].statuses[0]).toEqual(mockVehicleMissionStatus);

      expect(vehicleMissionRepository.findAll).toHaveBeenCalledTimes(1);
      expect(vehicleMissionStatusRepository.findByIds).toHaveBeenCalledWith([
        vehicleMissionId,
      ]);
      expect(vehicleRepository.findByIds).toHaveBeenCalledWith([vehicleId]);
      expect(missionRepository.findByIds).toHaveBeenCalledWith([missionId]);
    });

    it('should handle multiple statuses for the same vehicle mission', async () => {
      // Arrange
      const vehicleMissionId = 'vm-123';
      const vehicleId = 'v-123';
      const missionId = 'm-123';

      const mockVehicleMission: VehicleMission = {
        vehicleMissionId,
        vehicleId,
        missionId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockVehicleMissionStatuses: VehicleMissionStatus[] = [
        {
          vehicleMissionId,
          status: MissionStatus.PENDING,
          timestamp: new Date(2023, 0, 1),
        },
        {
          vehicleMissionId,
          status: MissionStatus.IN_PROGRESS,
          timestamp: new Date(2023, 0, 2),
        },
      ];

      const mockVehicle: Vehicle = {
        vehicleId,
        name: 'Test Vehicle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMission: Mission = {
        missionId,
        name: 'Test Mission',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vehicleMissionRepository.findAll.mockResolvedValue([mockVehicleMission]);
      vehicleMissionStatusRepository.findByIds.mockResolvedValue(
        mockVehicleMissionStatuses,
      );
      vehicleRepository.findByIds.mockResolvedValue([mockVehicle]);
      missionRepository.findByIds.mockResolvedValue([mockMission]);

      // Act
      const result = await service.getMissionReports();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].vehicle).toEqual(mockVehicle);
      expect(result[0].mission).toEqual(mockMission);
      expect(result[0].statuses).toHaveLength(2);
      expect(result[0].statuses).toEqual(mockVehicleMissionStatuses);
    });

    it('should handle errors when repositories throw exceptions', async () => {
      // Arrange
      const errorMessage = 'Database error';
      vehicleMissionRepository.findAll.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(service.getMissionReports()).rejects.toThrow(errorMessage);
      expect(vehicleMissionRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
