import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateVehicleMissionDto } from '@autonomous/vehicle-mission/dtos';
import { VehicleMissionService } from '@autonomous/vehicle-mission/vehicle-mission.service';
import { JwtGuard } from '@autonomous/common/guards';
import { EventService } from '@autonomous/event/event.service';
import { EventTopic } from '@autonomous/shared/types';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Vehicle Missions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: 'vehicle-mission', version: '1' })
export class VehicleMissionController {
  constructor(
    private readonly vehicleMissionService: VehicleMissionService,
    private readonly eventService: EventService,
  ) {}

  @ApiOperation({ summary: 'Create a new vehicle mission' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle mission created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async create(@Body() payload: CreateVehicleMissionDto) {
    const result = await this.vehicleMissionService.create(payload);
    this.eventService.emit(EventTopic.CREATE_VEHICLE_MISSION, result);
    return result;
  }

  @ApiOperation({ summary: 'Get vehicle mission by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle mission ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the vehicle mission with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Vehicle mission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.vehicleMissionService.findById(id);
  }

  @ApiOperation({ summary: 'Get all vehicle missions' })
  @ApiResponse({ status: 200, description: 'Returns all vehicle missions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findAll() {
    return this.vehicleMissionService.findAll();
  }
}
