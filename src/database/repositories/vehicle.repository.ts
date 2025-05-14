import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from '@autonomous/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {}

  async find(vehicleId: string): Promise<Vehicle | null> {
    return this.repository.findOne({ where: { vehicleId } });
  }
}
