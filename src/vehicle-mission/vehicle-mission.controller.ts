import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateVehicleMissionDto } from '@autonomous/vehicle-mission/dtos';
import { VehicleMissionService } from '@autonomous/vehicle-mission/vehicle-mission.service';
import { Topic } from '@autonomous/shared/types';
import { MqttPublisherService } from '@autonomous/messaging';
import { JwtGuard } from '@autonomous/common/guards';

@UseGuards(JwtGuard)
@Controller({ path: 'vehicle-mission', version: '1' })
export class VehicleMissionController {
  constructor(
    private readonly vehicleMissionService: VehicleMissionService,
    private readonly publisher: MqttPublisherService,
  ) {}

  @Post()
  async createVehicleMission(@Body() payload: CreateVehicleMissionDto) {
    const mission = await this.vehicleMissionService.create(payload);
    await this.publisher.publish(Topic.VEHICLE_MISSION, mission);
    return mission;
  }
}
