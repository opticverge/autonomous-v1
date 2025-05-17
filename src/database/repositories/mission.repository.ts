import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionEntity } from '@autonomous/database/entities';
import { MongoRepository } from 'typeorm';
import { CreateMission, Mission } from '@autonomous/shared/types';

@Injectable()
export class MissionRepository {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly repository: MongoRepository<MissionEntity>,
  ) {}

  async create(data: CreateMission): Promise<Mission> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    const { _id: _, ...response } = saved;
    return response;
  }
}
