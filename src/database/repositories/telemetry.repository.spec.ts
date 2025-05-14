import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryRepository } from './telemetry.repository';

describe('TelemetryRepositoryService', () => {
  let service: TelemetryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetryRepository],
    }).compile();

    service = module.get<TelemetryRepository>(TelemetryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
