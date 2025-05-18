import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleMissionListener } from './create-vehicle-mission-listener';
import { MqttPublisherService } from '@autonomous/messaging';
import { VehicleMissionStatusService } from '@autonomous/vehicle-mission/vehicle-mission-status.service';
import { Logger } from '@nestjs/common';
import {
  EventTopic,
  VehicleMissionStatusResponse,
} from '@autonomous/shared/types';
import { MissionStatus } from '@autonomous/database/entities';

describe('CreateVehicleMissionListenerService', () => {
  let service: CreateVehicleMissionListener;
  let mockLogger: { error: jest.Mock; log: jest.Mock };
  let mockPublisher: { publish: jest.Mock };
  let mockVehicleMissionStatusService: { create: jest.Mock };

  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
      log: jest.fn(),
    };

    mockPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    mockVehicleMissionStatusService = {
      create: jest.fn(),
    };

    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleMissionListener,
        {
          provide: MqttPublisherService,
          useValue: mockPublisher,
        },
        {
          provide: VehicleMissionStatusService,
          useValue: mockVehicleMissionStatusService,
        },
      ],
    }).compile();

    service = module.get<CreateVehicleMissionListener>(
      CreateVehicleMissionListener,
    );

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCreateVehicleMissionEvent', () => {
    it('should process create vehicle mission event successfully', async () => {
      const payload: VehicleMissionStatusResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        status: MissionStatus.PENDING,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedStatus = {
        vehicleMissionId: 'vm-id',
        status: MissionStatus.QUEUED,
        timestamp: new Date(),
      };

      mockVehicleMissionStatusService.create.mockResolvedValue(updatedStatus);

      await service.handleCreateVehicleMissionEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Processing ${EventTopic.CREATE_VEHICLE_MISSION} event for vehicle:${payload.vehicleId}`,
      );
      expect(mockVehicleMissionStatusService.create).toHaveBeenCalledWith({
        vehicleMissionId: payload.vehicleMissionId,
        status: MissionStatus.QUEUED,
      });
      expect(mockPublisher.publish).toHaveBeenCalledWith(
        `vehicle/${payload.vehicleId}/mission`,
        { ...payload, ...updatedStatus },
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle errors when processing create vehicle mission event', async () => {
      const payload: VehicleMissionStatusResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        status: MissionStatus.PENDING,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const error = new Error('Test error');
      mockVehicleMissionStatusService.create.mockRejectedValue(error);

      await service.handleCreateVehicleMissionEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Processing ${EventTopic.CREATE_VEHICLE_MISSION} event for vehicle:${payload.vehicleId}`,
      );
      expect(mockVehicleMissionStatusService.create).toHaveBeenCalledWith({
        vehicleMissionId: payload.vehicleMissionId,
        status: MissionStatus.QUEUED,
      });
      expect(mockPublisher.publish).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error while processing ${EventTopic.CREATE_VEHICLE_MISSION} event`,
        {
          error,
          payload,
        },
      );
    });

    it('should handle non-Error objects in catch block', async () => {
      const payload: VehicleMissionStatusResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        status: MissionStatus.PENDING,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const errorObj = { message: 'Non-error object' };
      mockVehicleMissionStatusService.create.mockRejectedValue(errorObj);

      await service.handleCreateVehicleMissionEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Processing ${EventTopic.CREATE_VEHICLE_MISSION} event for vehicle:${payload.vehicleId}`,
      );
      expect(mockVehicleMissionStatusService.create).toHaveBeenCalledWith({
        vehicleMissionId: payload.vehicleMissionId,
        status: MissionStatus.QUEUED,
      });
      expect(mockPublisher.publish).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Error while processing ${EventTopic.CREATE_VEHICLE_MISSION} event`,
        {
          error: JSON.stringify(errorObj),
          payload,
        },
      );
    });
  });
});
