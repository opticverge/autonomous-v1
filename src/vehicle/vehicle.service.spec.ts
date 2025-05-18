import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from '@autonomous/database/repositories';
import { NotFoundException } from '@nestjs/common';
import {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from '@autonomous/shared/types';

describe('VehicleService', () => {
  let service: VehicleService;
  let mockRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: VehicleRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createDto: CreateVehicle = {
        name: 'Test Vehicle',
      };

      const expectedResult: Vehicle = {
        vehicleId: 'test-id',
        name: 'Test Vehicle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('find', () => {
    it('should return a vehicle if it exists', async () => {
      const vehicleId = 'test-id';
      const expectedResult: Vehicle = {
        vehicleId,
        name: 'Test Vehicle',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(expectedResult);

      const result = await service.find(vehicleId);

      expect(mockRepository.findById).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if vehicle does not exist', async () => {
      const vehicleId = 'non-existent-id';

      mockRepository.findById.mockResolvedValue(null);

      await expect(service.find(vehicleId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(vehicleId);
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      const expectedResult: Vehicle[] = [
        {
          vehicleId: 'test-id-1',
          name: 'Test Vehicle 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          vehicleId: 'test-id-2',
          name: 'Test Vehicle 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return an empty array if no vehicles exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const vehicleId = 'test-id';
      const updateDto: UpdateVehicle = {
        name: 'Updated Vehicle Name',
      };

      mockRepository.update.mockResolvedValue(undefined);

      await service.update(vehicleId, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(vehicleId, updateDto);
    });

    it('should handle errors from the repository', async () => {
      const vehicleId = 'test-id';
      const updateDto: UpdateVehicle = {
        name: 'Updated Vehicle Name',
      };

      const error = new Error('Repository error');
      mockRepository.update.mockRejectedValue(error);

      await expect(service.update(vehicleId, updateDto)).rejects.toThrow(error);
      expect(mockRepository.update).toHaveBeenCalledWith(vehicleId, updateDto);
    });
  });
});
