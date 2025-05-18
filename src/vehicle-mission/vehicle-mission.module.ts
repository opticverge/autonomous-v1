import { Module } from '@nestjs/common';
import { DatabaseModule } from '@autonomous/database/database.module';
import { VehicleMissionController } from '@autonomous/vehicle-mission/vehicle-mission.controller';
import { VehicleMissionService } from '@autonomous/vehicle-mission/vehicle-mission.service';
import { VehicleMissionStatusService } from '@autonomous/vehicle-mission/vehicle-mission-status.service';
import { MessagingModule } from '@autonomous/messaging/messaging.module';
import {
  VehicleMissionStatusListener,
  CreateVehicleMissionListener,
  VehicleMissionListener,
} from '@autonomous/vehicle-mission/listeners';

import { EventModule } from '@autonomous/event/event.module';

@Module({
  imports: [DatabaseModule, MessagingModule, EventModule],
  controllers: [VehicleMissionController],
  providers: [
    VehicleMissionService,
    VehicleMissionStatusService,
    VehicleMissionStatusListener,
    CreateVehicleMissionListener,
    VehicleMissionListener,
  ],
  exports: [VehicleMissionService, VehicleMissionStatusService],
})
export class VehicleMissionModule {}
