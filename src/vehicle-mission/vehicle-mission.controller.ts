import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateVehicleMissionDto } from '@autonomous/vehicle-mission/dtos';
import { VehicleMissionService } from '@autonomous/vehicle-mission/vehicle-mission.service';
import { Topic } from '@autonomous/shared/types';
import { MqttEventBusService } from '@autonomous/messaging';
import { JwtGuard } from '@autonomous/common/guards';

@UseGuards(JwtGuard)
@Controller('vehicle-mission')
export class VehicleMissionController {
  constructor(
    private readonly vehicleMissionService: VehicleMissionService,
    private readonly eventBusService: MqttEventBusService,
  ) {}

  @Post()
  async createVehicleMission(@Body() payload: CreateVehicleMissionDto) {
    const mission = await this.vehicleMissionService.create(payload);

    await this.eventBusService.publish({
      topic: Topic.VEHICLE_MISSION,
      payload: mission,
    });

    return mission;
  }
}
