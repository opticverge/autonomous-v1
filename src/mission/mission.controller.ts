import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MissionService } from '@autonomous/mission/mission.service';
import { CreateMissionDto } from '@autonomous/mission/dtos';
import { JwtGuard } from '@autonomous/common/guards';

@UseGuards(JwtGuard)
@Controller({ path: 'mission', version: '1' })
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post()
  async create(@Body() payload: CreateMissionDto) {
    return await this.missionService.create(payload);
  }

  @Get()
  async findAll() {
    return await this.missionService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.missionService.findById(id);
  }
}
