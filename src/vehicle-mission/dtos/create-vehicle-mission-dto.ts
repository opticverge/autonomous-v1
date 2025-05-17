import { CreateVehicleMission } from '@autonomous/shared/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVehicleMissionDto implements CreateVehicleMission {
  @IsOptional()
  @IsString()
  vehicleMissionId: string;

  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  missionId: string;
}
