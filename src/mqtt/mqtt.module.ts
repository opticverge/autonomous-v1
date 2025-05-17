import { Module } from '@nestjs/common';
import { MqttController } from '@autonomous/mqtt/mqtt.controller';
import { TelemetryService } from '@autonomous/mqtt/services';
import { DatabaseModule } from '@autonomous/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TelemetryService],
  controllers: [MqttController],
})
export class MqttModule {}
