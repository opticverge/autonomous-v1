import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMissionListener } from './vehicle-mission-listener';
import { MqttPublisherService } from '@autonomous/messaging';
import { Logger } from '@nestjs/common';
import { VehicleMissionStatusResponse } from '@autonomous/shared/types';
import { MissionStatus } from '@autonomous/database/entities';

describe('VehicleMissionListenerService', () => {
  let service: VehicleMissionListener;
  let mockLogger: { error: jest.Mock; log: jest.Mock };
  let mockPublisherService: { publish: jest.Mock };
  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
      log: jest.fn(),
    };

    mockPublisherService = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLogger.error);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLogger.log);

    jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
      callback();
      return 1 as unknown as NodeJS.Timeout;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleMissionListener,
        {
          provide: MqttPublisherService,
          useValue: mockPublisherService,
        },
      ],
    }).compile();

    service = module.get<VehicleMissionListener>(VehicleMissionListener);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleSimulatedVehicleMissionEvent', () => {
    it('should process vehicle mission event successfully with COMPLETED status', async () => {
      const payload: VehicleMissionStatusResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        status: MissionStatus.PENDING,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);

      await service.handleSimulatedVehicleMissionEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Vehicle received mission from MQTT vehicleId:${payload.vehicleId} mission:${payload.missionId}`,
      );

      expect(mockPublisherService.publish).toHaveBeenCalledWith(
        `vehicle/${payload.vehicleId}/mission/status`,
        expect.objectContaining({
          vehicleId: payload.vehicleId,
          vehicleMissionId: payload.vehicleMissionId,
          status: MissionStatus.IN_PROGRESS,
        }),
      );

      expect(mockPublisherService.publish).toHaveBeenCalledWith(
        `vehicle/${payload.vehicleId}/mission/status`,
        expect.objectContaining({
          vehicleId: payload.vehicleId,
          vehicleMissionId: payload.vehicleMissionId,
          status: MissionStatus.COMPLETED,
        }),
      );

      expect(mockLogger.error).not.toHaveBeenCalled();

      Math.random = originalRandom;
    });

    it('should process vehicle mission event successfully with FAILED status', async () => {
      const payload: VehicleMissionStatusResponse = {
        vehicleMissionId: 'vm-id',
        vehicleId: 'vehicle-id',
        missionId: 'mission-id',
        status: MissionStatus.PENDING,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.96);

      await service.handleSimulatedVehicleMissionEvent(payload);

      expect(mockPublisherService.publish).toHaveBeenCalledWith(
        `vehicle/${payload.vehicleId}/mission/status`,
        expect.objectContaining({
          vehicleId: payload.vehicleId,
          vehicleMissionId: payload.vehicleMissionId,
          status: MissionStatus.FAILED,
        }),
      );

      Math.random = originalRandom;
    });

    it('should handle errors when publishing mission status', async () => {
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
      mockPublisherService.publish.mockRejectedValue(error);

      await service.handleSimulatedVehicleMissionEvent(payload);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error while handling simulated vehicle mission status update',
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
      mockPublisherService.publish.mockRejectedValue(errorObj);

      await service.handleSimulatedVehicleMissionEvent(payload);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error while handling simulated vehicle mission status update',
        {
          error: JSON.stringify(errorObj),
          payload,
        },
      );
    });
  });
});
