import { CreateMission } from '@autonomous/shared/types';

import { IsOptional, IsString } from 'class-validator';

export class CreateMissionDto implements CreateMission {
  @IsOptional()
  @IsString()
  missionId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
