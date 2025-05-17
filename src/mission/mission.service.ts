import { Injectable } from '@nestjs/common';
import { MissionRepository } from '@autonomous/database/repositories';
import { CreateMission, Mission } from '@autonomous/shared/types';

@Injectable()
export class MissionService {
  constructor(private readonly missionRepository: MissionRepository) {}

  async createMission(request: CreateMission): Promise<Mission> {
    return await this.missionRepository.create(request);
  }
}
