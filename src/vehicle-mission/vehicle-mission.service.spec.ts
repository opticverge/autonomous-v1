import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionService } from './vehicle-mission.service';
import {
  VehicleMissionRepository,
  VehicleMissionStatusRepository,
  VehicleRepository,
  MissionRepository,
} from '@autonomous/database/repositories';
import { NotFoundException } from '@nestjs/common';
import { CreateVehicleMission, VehicleMission } from '@autonomous/shared/types';
import { MissionStatus } from '@autonomous/database/entities';

describe('VehicleMissionService', () => {
  let service: VehicleMissionService;

  const mockVehicleMissionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  const mockVehicleMissionStatusRepository = {
    create: jest.fn(),
  };

  const mockVehicleRepository = {
    findById: jest.fn(),
  };

  const mockMissionRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMissionService,
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

    service = module.get<VehicleMissionService>(VehicleMissionService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle mission successfully', async () => {
      const createDto: CreateVehicleMission = {
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        vehicleMissionId: 'vm-id',
      };

      const vehicle = { id: 'vehicle-id', name: 'Test Vehicle' };
      const mission = { id: 'mission-id', name: 'Test Mission' };

      const vehicleMission = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        createdAt: new Date(),
      };

      const missionStatus = {
        vehicleMissionId: 'vm-id',
        status: MissionStatus.PENDING,
        createdAt: new Date(),
      };

      mockVehicleRepository.findById.mockResolvedValue(vehicle);
      mockMissionRepository.findById.mockResolvedValue(mission);
      mockVehicleMissionRepository.create.mockResolvedValue(vehicleMission);
      mockVehicleMissionStatusRepository.create.mockResolvedValue(
        missionStatus,
      );

      const result = await service.create(createDto);

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith(
        createDto.vehicleId,
      );
      expect(mockMissionRepository.findById).toHaveBeenCalledWith(
        createDto.missionId,
      );
      expect(mockVehicleMissionRepository.create).toHaveBeenCalledWith(
        createDto,
      );
      expect(mockVehicleMissionStatusRepository.create).toHaveBeenCalledWith({
        vehicleMissionId: vehicleMission.vehicleMissionId,
        status: MissionStatus.PENDING,
      });
      expect(result).toEqual({ ...vehicleMission, ...missionStatus });
    });

    it('should throw NotFoundException when vehicle is not found', async () => {
      const createDto: CreateVehicleMission = {
        vehicleId: 'non-existent-vehicle',
        missionId: 'mission-id',
        vehicleMissionId: 'vm-id',
      };

      mockVehicleRepository.findById.mockResolvedValue(null);
      mockMissionRepository.findById.mockResolvedValue({ id: 'mission-id' });

      await expect(service.create(createDto)).rejects.toThrow(
        new NotFoundException(
          `Vehicle with id ${createDto.vehicleId} not found`,
        ),
      );

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith(
        createDto.vehicleId,
      );
      expect(mockVehicleMissionRepository.create).not.toHaveBeenCalled();
      expect(mockVehicleMissionStatusRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when mission is not found', async () => {
      const createDto: CreateVehicleMission = {
        vehicleId: 'vehicle-id',
        missionId: 'non-existent-mission',
        vehicleMissionId: 'vm-id',
      };

      mockVehicleRepository.findById.mockResolvedValue({ id: 'vehicle-id' });
      mockMissionRepository.findById.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        new NotFoundException(
          `Mission with id ${createDto.missionId} not found`,
        ),
      );

      expect(mockVehicleRepository.findById).toHaveBeenCalledWith(
        createDto.vehicleId,
      );
      expect(mockMissionRepository.findById).toHaveBeenCalledWith(
        createDto.missionId,
      );
      expect(mockVehicleMissionRepository.create).not.toHaveBeenCalled();
      expect(mockVehicleMissionStatusRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicle missions', async () => {
      const expectedResult: VehicleMission[] = [
        {
          vehicleMissionId: 'vm-id-1',
          vehicleId: 'vehicle-id-1',
          missionId: 'mission-id-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          vehicleMissionId: 'vm-id-2',
          vehicleId: 'vehicle-id-2',
          missionId: 'mission-id-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockVehicleMissionRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockVehicleMissionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return an empty array if no vehicle missions exist', async () => {
      mockVehicleMissionRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockVehicleMissionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a vehicle mission if it exists', async () => {
      const id = 'vm-id';
      const expectedResult: VehicleMission = {
        vehicleMissionId: id,
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockVehicleMissionRepository.findById.mockResolvedValue(expectedResult);

      const result = await service.findById(id);

      expect(mockVehicleMissionRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if vehicle mission does not exist', async () => {
      const id = 'non-existent-id';

      mockVehicleMissionRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      expect(mockVehicleMissionRepository.findById).toHaveBeenCalledWith(id);
    });
  });
});
