import { UpdateVehicle } from '@autonomous/shared/types';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVehicleDto implements UpdateVehicle {
  @IsOptional()
  @IsString()
  name: string;
}
