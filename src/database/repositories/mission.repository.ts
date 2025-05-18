import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionEntity } from '@autonomous/database/entities';
import { MongoRepository } from 'typeorm';
import { CreateMission, Mission } from '@autonomous/shared/types';
import { Nullable } from '@autonomous/common/types';

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

  async findById(missionId: string): Promise<Nullable<Mission>> {
    const mission = await this.repository.findOne({ where: { missionId } });
    if (!mission) return null;
    const { _id: _, ...response } = mission;
    return response;
  }

  async findByIds(ids: string[]): Promise<Mission[]> {
    const entities = await this.repository.find({
      where: { missionId: { $in: ids } },
    });

    if (!entities) return [];

    return entities.map((entity) => {
      const { _id: _, ...response } = entity;
      return response;
    });
  }

  async findAll(): Promise<Mission[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => {
      const { _id: _, ...response } = entity;
      return response;
    });
  }
}
