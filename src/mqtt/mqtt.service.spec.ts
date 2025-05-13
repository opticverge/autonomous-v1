import { Test, TestingModule } from '@nestjs/testing';
import { MqttService } from '@autonomous/mqtt/mqtt.service';
import { MQTT_SERVICE_NAME } from '@autonomous/mqtt/mqtt.constants';

describe('MqttService', () => {
  let service: MqttService;

  beforeEach(async () => {
    const mockClientProxy = {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MqttService,
        {
          provide: MQTT_SERVICE_NAME,
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<MqttService>(MqttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
