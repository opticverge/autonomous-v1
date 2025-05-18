import { Test, TestingModule } from '@nestjs/testing';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MQTT_PUBLISHER_NAME } from './messaging.constants';
import { Logger } from '@nestjs/common';
import { of } from 'rxjs';
import { MqttMessageTopic, VehicleTelemetry } from '@autonomous/shared/types';

describe('MqttEventBusService', () => {
  let service: MqttPublisherService;
  let mockLogger: { error: jest.Mock; log: jest.Mock };

  const mockClientProxy = {
    emit: jest.fn().mockReturnValue(of(undefined)),
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
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
        MqttPublisherService,
        {
          provide: MQTT_PUBLISHER_NAME,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<MqttPublisherService>(MqttPublisherService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should publish a message to the MQTT broker', async () => {
      const topic = 'vehicle/test-id/telemetry' as MqttMessageTopic;
      const payload: VehicleTelemetry = {
        vehicleId: 'test-id',
        status: 'active',
        timestamp: new Date(),
        location: { type: 'Point', coordinates: [0, 0] },
      };

      await service.publish(topic, payload);

      expect(mockClientProxy.emit).toHaveBeenCalledWith(topic, payload);
    });
  });
});
