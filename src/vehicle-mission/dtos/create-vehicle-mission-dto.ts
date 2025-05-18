import { CreateVehicleMission } from '@autonomous/shared/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleMissionDto implements CreateVehicleMission {
  @ApiProperty({
    description: 'The unique identifier for the vehicle mission',
    example: 'vm-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicleMissionId: string;

  @ApiProperty({
    description: 'The ID of the vehicle to assign to the mission',
    example: 'vehicle-456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    description: 'The ID of the mission to assign the vehicle to',
    example: 'mission-789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  missionId: string;
}
