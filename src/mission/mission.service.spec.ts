import { Test, TestingModule } from '@nestjs/testing';
import { MissionService } from './mission.service';
import { MissionRepository } from '@autonomous/database/repositories';
import { NotFoundException } from '@nestjs/common';
import { CreateMission, Mission } from '@autonomous/shared/types';

describe('MissionService', () => {
  let service: MissionService;

  const mockMissionRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIds: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionService,
        {
          provide: MissionRepository,
          useValue: mockMissionRepository,
        },
      ],
    }).compile();

    service = module.get<MissionService>(MissionService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new mission', async () => {
      const createMissionDto: CreateMission = {
        missionId: 'test-id',
        name: 'Test Mission',
        description: 'Test Description',
      };

      const expectedResult: Mission = {
        missionId: 'test-id',
        name: 'Test Mission',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMissionRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createMissionDto);

      expect(mockMissionRepository.create).toHaveBeenCalledWith(
        createMissionDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of missions', async () => {
      const expectedResult: Mission[] = [
        {
          missionId: 'test-id-1',
          name: 'Test Mission 1',
          description: 'Test Description 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          missionId: 'test-id-2',
          name: 'Test Mission 2',
          description: 'Test Description 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMissionRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(mockMissionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return an empty array if no missions exist', async () => {
      mockMissionRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockMissionRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a mission if it exists', async () => {
      const missionId = 'test-id';
      const expectedResult: Mission = {
        missionId: missionId,
        name: 'Test Mission',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMissionRepository.findById.mockResolvedValue(expectedResult);

      const result = await service.findById(missionId);

      expect(mockMissionRepository.findById).toHaveBeenCalledWith(missionId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if mission does not exist', async () => {
      const missionId = 'non-existent-id';

      mockMissionRepository.findById.mockResolvedValue(null);

      await expect(service.findById(missionId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockMissionRepository.findById).toHaveBeenCalledWith(missionId);
    });
  });
});
