import { IsOptional, IsString } from 'class-validator';
import { CreateVehicle } from '@autonomous/shared/types';

export class CreateVehicleDto implements CreateVehicle {
  @IsOptional()
  @IsString()
  name: string;
}
