import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateVehicleMissionDto } from '@autonomous/vehicle-mission/dtos';
import { VehicleMissionService } from '@autonomous/vehicle-mission/vehicle-mission.service';
import { JwtGuard } from '@autonomous/common/guards';
import { EventService } from '@autonomous/event/event.service';
import { EventTopic } from '@autonomous/shared/types';

@UseGuards(JwtGuard)
@Controller({ path: 'vehicle-mission', version: '1' })
export class VehicleMissionController {
  constructor(
    private readonly vehicleMissionService: VehicleMissionService,
    private readonly eventService: EventService,
  ) {}

  @Post()
  async create(@Body() payload: CreateVehicleMissionDto) {
    const result = await this.vehicleMissionService.create(payload);
    this.eventService.emit(EventTopic.CREATE_VEHICLE_MISSION, result);
    return result;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.vehicleMissionService.findById(id);
  }

  @Get()
  async findAll() {
    return this.vehicleMissionService.findAll();
  }
}
