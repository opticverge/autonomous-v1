import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { VehicleService } from '@autonomous/vehicle/vehicle.service';
import { TelemetryRepository } from '@autonomous/database/repositories';
import { Logger } from '@nestjs/common';
import { VehicleTelemetry } from '@autonomous/shared/types';

describe('TelemetryService', () => {
  let service: TelemetryService;
  let mockLogger: { error: jest.Mock; log: jest.Mock };

  const mockVehicleService = {
    find: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  };

  const mockTelemetryRepository = {
    create: jest.fn(),
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
        TelemetryService,
        {
          provide: VehicleService,
          useValue: mockVehicleService,
        },
        {
          provide: TelemetryRepository,
          useValue: mockTelemetryRepository,
        },
      ],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByVehicleId', () => {
    it('should find telemetry data for a valid vehicle ID', async () => {
      const vehicleId = 'test-vehicle-id';
      const mockTelemetryData = [
        { vehicleId, timestamp: new Date() },
      ] as VehicleTelemetry[];

      mockVehicleService.find.mockResolvedValue({ id: vehicleId });
      mockTelemetryRepository.findByVehicleId.mockResolvedValue(
        mockTelemetryData,
      );

      const result = await service.findByVehicleId(vehicleId);

      expect(mockVehicleService.find).toHaveBeenCalledWith(vehicleId);
      expect(mockTelemetryRepository.findByVehicleId).toHaveBeenCalledWith(
        vehicleId,
      );
      expect(result).toEqual(mockTelemetryData);
    });

    it('should throw an error if vehicle is not found', async () => {
      const vehicleId = 'non-existent-vehicle';
      mockVehicleService.find.mockRejectedValue(new Error('Vehicle not found'));

      await expect(service.findByVehicleId(vehicleId)).rejects.toThrow();
      expect(mockVehicleService.find).toHaveBeenCalledWith(vehicleId);
      expect(mockTelemetryRepository.findByVehicleId).not.toHaveBeenCalled();
    });
  });

  describe('process', () => {
    it('should process valid telemetry data', async () => {
      const telemetry = {
        vehicleId: 'test-vehicle-id',
        timestamp: new Date(),
      } as VehicleTelemetry;

      mockVehicleService.find.mockResolvedValue({ id: telemetry.vehicleId });
      mockTelemetryRepository.create.mockResolvedValue(undefined);

      await service.process(telemetry);

      expect(mockVehicleService.find).toHaveBeenCalledWith(telemetry.vehicleId);
      expect(mockTelemetryRepository.create).toHaveBeenCalledWith(telemetry);
      expect(mockLogger.log).toHaveBeenCalledWith(
        `Telemetry data processed for vehicle:${telemetry.vehicleId}`,
      );
    });

    it('should not process telemetry data with missing vehicle ID', async () => {
      const telemetry = { timestamp: new Date() } as VehicleTelemetry;

      await service.process(telemetry);

      expect(mockVehicleService.find).not.toHaveBeenCalled();
      expect(mockTelemetryRepository.create).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Vehicle ID is missing in telemetry data'),
      );
    });

    it('should not process telemetry data for non-existent vehicle', async () => {
      const telemetry = {
        vehicleId: 'non-existent-vehicle',
        timestamp: new Date(),
      } as VehicleTelemetry;

      mockVehicleService.find.mockRejectedValue(new Error('Vehicle not found'));

      await service.process(telemetry);

      expect(mockVehicleService.find).toHaveBeenCalledWith(telemetry.vehicleId);
      expect(mockTelemetryRepository.create).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Vehicle not found for telemetry data'),
      );
    });
  });
});
