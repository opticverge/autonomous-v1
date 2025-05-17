import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionEntity } from '@autonomous/database/entities';
import { MongoRepository } from 'typeorm';
import { CreateMission } from '@autonomous/shared/types';

@Injectable()
export class MissionRepository {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly repository: MongoRepository<MissionEntity>,
  ) {}

  async create(data: CreateMission): Promise<MissionEntity> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
}
