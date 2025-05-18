import { CreateMission } from '@autonomous/shared/types';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMissionDto implements CreateMission {
  @ApiProperty({
    description: 'The unique identifier for the mission',
    example: 'mission-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  missionId: string;

  @ApiProperty({
    description: 'The name of the mission',
    example: 'Surveillance Mission',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'A description of the mission',
    example: 'This mission involves surveillance of a specific area',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
