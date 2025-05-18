import { UpdateVehicle } from '@autonomous/shared/types';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVehicleDto implements UpdateVehicle {
  @ApiProperty({
    description: 'The updated name of the vehicle',
    example: 'Updated Vehicle Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;
}
