import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionStatusListener } from './vehicle-mission-status-listener';
import { VehicleMissionStatusService } from '@autonomous/vehicle-mission/vehicle-mission-status.service';
import { Logger } from '@nestjs/common';
import { EventTopic, VehicleMissionResponse } from '@autonomous/shared/types';
import { MissionStatus } from '@autonomous/database/entities';

describe('VehicleMissionStatusListenerService', () => {
  let service: VehicleMissionStatusListener;
  let mockLogger: { error: jest.Mock; log: jest.Mock };

  const mockVehicleMissionStatusService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
      log: jest.fn(),
    };

    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMissionStatusListener,
        {
          provide: VehicleMissionStatusService,
          useValue: mockVehicleMissionStatusService,
        },
      ],
    }).compile();

    service = module.get<VehicleMissionStatusListener>(
      VehicleMissionStatusListener,
    );

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleVehicleMissionStatusEvent', () => {
    it('should process vehicle mission status event successfully', async () => {
      const payload: VehicleMissionResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        status: MissionStatus.IN_PROGRESS,
        timestamp: new Date(),
      };

      mockVehicleMissionStatusService.create.mockResolvedValue(undefined);

      await service.handleVehicleMissionStatusEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Processing ${EventTopic.VEHICLE_MISSION_STATUS} event for vehicle:${payload.vehicleId}`
      );
      expect(mockVehicleMissionStatusService.create).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle errors when processing vehicle mission status event', async () => {
      const payload: VehicleMissionResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        status: MissionStatus.IN_PROGRESS,
        timestamp: new Date(),
      };

      const error = new Error('Test error');
      mockVehicleMissionStatusService.create.mockRejectedValue(error);

      await service.handleVehicleMissionStatusEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Processing ${EventTopic.VEHICLE_MISSION_STATUS} event for vehicle:${payload.vehicleId}`
      );
      expect(mockVehicleMissionStatusService.create).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error while handling vehicle mission status event',
        {
          error,
          payload,
        }
      );
    });

    it('should handle non-Error objects in catch block', async () => {
      const payload: VehicleMissionResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        status: MissionStatus.IN_PROGRESS,
        timestamp: new Date(),
      };

      const errorObj = { message: 'Non-error object' };
      mockVehicleMissionStatusService.create.mockRejectedValue(errorObj);

      await service.handleVehicleMissionStatusEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Processing ${EventTopic.VEHICLE_MISSION_STATUS} event for vehicle:${payload.vehicleId}`
      );
      expect(mockVehicleMissionStatusService.create).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error while handling vehicle mission status event',
        {
          error: JSON.stringify(errorObj),
          payload,
        }
      );
    });
  });
});
