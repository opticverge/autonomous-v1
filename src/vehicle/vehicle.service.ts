import { Injectable } from '@nestjs/common';
import {
  CreateVehicle,
  UpdateVehicle,
  Vehicle,
} from '@autonomous/shared/types';
import { VehicleRepository } from '@autonomous/database/repositories';
import { Nullable } from '@autonomous/common/types';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(data: CreateVehicle): Promise<Vehicle> {
    return this.vehicleRepository.create(data);
  }

  async find(vehicleId: string): Promise<Nullable<Vehicle>> {
    return this.vehicleRepository.find(vehicleId);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.findAll();
  }

  async update(vehicleId: string, data: UpdateVehicle): Promise<void> {
    await this.vehicleRepository.update(vehicleId, data);
  }
}
