import { Test, TestingModule } from '@nestjs/testing';
import { MqttEventBusService } from './mqtt-event-bus.service';

describe('MqttEventBusService', () => {
  let service: MqttEventBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MqttEventBusService],
    }).compile();

    service = module.get<MqttEventBusService>(MqttEventBusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
