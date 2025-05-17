import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MissionService } from '@autonomous/mission/mission.service';
import { CreateMissionDto } from '@autonomous/mission/dtos';
import { JwtGuard } from '@autonomous/common/guards';

@UseGuards(JwtGuard)
@Controller({ path: 'mission', version: '1' })
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post()
  async createMission(@Body() payload: CreateMissionDto) {
    return await this.missionService.createMission(payload);
  }
}
