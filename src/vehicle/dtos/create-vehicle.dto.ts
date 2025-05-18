import { IsOptional, IsString } from 'class-validator';
import { CreateVehicle } from '@autonomous/shared/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto implements CreateVehicle {
  @ApiProperty({
    description: 'The name of the vehicle',
    example: 'Autonomous Vehicle 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;
}
