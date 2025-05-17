import { Module } from '@nestjs/common';
import { MqttController } from '@autonomous/mqtt/mqtt.controller';
import { TelemetryService } from '@autonomous/mqtt/services';
import { DatabaseModule } from '@autonomous/database/database.module';
import { MissionModule } from '@autonomous/mission/mission.module';
import { VehicleMissionModule } from '@autonomous/vehicle-mission/vehicle-mission.module';

@Module({
  imports: [DatabaseModule, MissionModule, VehicleMissionModule],
  providers: [TelemetryService],
  controllers: [MqttController],
})
export class MqttModule {}
