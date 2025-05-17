import { Test, TestingModule } from '@nestjs/testing';
import { MqttPublisherService } from './mqtt-publisher.service';

describe('MqttEventBusService', () => {
  let service: MqttPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttPublisherService],
    }).compile();

    service = module.get<MqttPublisherService>(MqttPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
