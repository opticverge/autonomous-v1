import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MissionService } from '@autonomous/mission/mission.service';
import { CreateMissionDto } from '@autonomous/mission/dtos';
import { JwtGuard } from '@autonomous/common/guards';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Missions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: 'mission', version: '1' })
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @ApiOperation({ summary: 'Create a new mission' })
  @ApiResponse({ status: 201, description: 'Mission created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async create(@Body() payload: CreateMissionDto) {
    return await this.missionService.create(payload);
  }

  @ApiOperation({ summary: 'Get all missions' })
  @ApiResponse({ status: 200, description: 'Returns all missions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findAll() {
    return await this.missionService.findAll();
  }

  @ApiOperation({ summary: 'Get mission by ID' })
  @ApiParam({ name: 'id', description: 'Mission ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the mission with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Mission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.missionService.findById(id);
  }
}
