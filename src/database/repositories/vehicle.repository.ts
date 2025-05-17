import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleEntity } from '@autonomous/database/entities';
import { MongoRepository } from 'typeorm';
import { Nullable } from '@autonomous/common/types';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly repository: MongoRepository<VehicleEntity>,
  ) {}

  async find(vehicleId: string): Promise<Nullable<VehicleEntity>> {
    return this.repository.findOne({
      where: { vehicleId },
      select: {
        vehicleId: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
