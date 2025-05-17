import { Module } from '@nestjs/common';
import { MqttController } from '@autonomous/mqtt/mqtt.controller';
import { EventModule } from '@autonomous/event/event.module';

@Module({
  imports: [EventModule],
  controllers: [MqttController],
})
export class MqttModule {}
