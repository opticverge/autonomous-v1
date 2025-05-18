import { Injectable, NotFoundException } from '@nestjs/common';
import { MissionRepository } from '@autonomous/database/repositories';
import { CreateMission, Mission } from '@autonomous/shared/types';
import { Nullable } from '@autonomous/common/types';

@Injectable()
export class MissionService {
  constructor(private readonly missionRepository: MissionRepository) {}

  async create(request: CreateMission): Promise<Mission> {
    return await this.missionRepository.create(request);
  }

  async findAll(): Promise<Mission[]> {
    return await this.missionRepository.findAll();
  }

  async findById(id: string): Promise<Nullable<Mission>> {
    const result = await this.missionRepository.findById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
