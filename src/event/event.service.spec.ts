import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTopic } from '@autonomous/shared/types';

describe('EventService', () => {
  let service: EventService;
  let mockEventEmitter: { emit: jest.Mock };

  beforeEach(async () => {
    mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emit', () => {
    it('should emit an event with the provided topic and payload', () => {
      const topic = EventTopic.VEHICLE_TELEMETRY;
      const payload = {
        vehicleId: 'test-id',
        timestamp: new Date(),
        status: 'active',
        location: {
          type: 'Point' as const,
          coordinates: [0, 0] as [number, number],
        },
      };

      service.emit(topic, payload);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(topic, payload);
    });
  });
});
