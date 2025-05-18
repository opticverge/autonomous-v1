import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTelemetryListener } from './vehicle-telemetry-listener';
import { TelemetryService } from '@autonomous/telemetry/telemetry.service';
import { Logger } from '@nestjs/common';
import { VehicleTelemetry } from '@autonomous/shared/types';

describe('VehicleTelemetryListenerService', () => {
  let service: VehicleTelemetryListener;
  let mockLogger: { error: jest.Mock; log: jest.Mock };

  const mockTelemetryService = {
    process: jest.fn(),
    findByVehicleId: jest.fn(),
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
        VehicleTelemetryListener,
        {
          provide: TelemetryService,
          useValue: mockTelemetryService,
        },
      ],
    }).compile();

    service = module.get<VehicleTelemetryListener>(VehicleTelemetryListener);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleVehicleTelemetryEvent', () => {
    it('should process telemetry data successfully', async () => {
      const payload = {
        vehicleId: 'test-vehicle-id',
        timestamp: new Date(),
      } as VehicleTelemetry;

      mockTelemetryService.process.mockResolvedValue(undefined);

      await service.handleVehicleTelemetryEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Received vehicle telemetry event for vehicle:${payload.vehicleId}`,
      );
      expect(mockTelemetryService.process).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle errors when processing telemetry data', async () => {
      const payload = {
        vehicleId: 'test-vehicle-id',
        timestamp: new Date(),
      } as VehicleTelemetry;
      const error = new Error('Test error');

      mockTelemetryService.process.mockRejectedValue(error);

      await service.handleVehicleTelemetryEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Received vehicle telemetry event for vehicle:${payload.vehicleId}`,
      );
      expect(mockTelemetryService.process).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error while processing vehicle telemetry event',
        {
          error,
          payload,
        },
      );
    });

    it('should handle non-Error objects in catch block', async () => {
      const payload = {
        vehicleId: 'test-vehicle-id',
        timestamp: new Date(),
      } as VehicleTelemetry;
      const errorObj = { message: 'Non-error object' };

      mockTelemetryService.process.mockRejectedValue(errorObj);

      await service.handleVehicleTelemetryEvent(payload);

      expect(mockLogger.log).toHaveBeenCalledWith(
        `Received vehicle telemetry event for vehicle:${payload.vehicleId}`,
      );
      expect(mockTelemetryService.process).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error while processing vehicle telemetry event',
        {
          error: JSON.stringify(errorObj),
          payload,
        },
      );
    });
  });
});
