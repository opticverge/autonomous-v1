import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { MqttEventBusService } from './mqtt-event-bus.service';
import { MQTT_EVENT_BUS_NAME } from '@autonomous/messaging/messaging.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MQTT_EVENT_BUS_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: configService.getOrThrow<string>('MQTT_URL'),
            username: configService.getOrThrow<string>('MQTT_USERNAME'),
            password: configService.getOrThrow<string>('MQTT_PASSWORD'),
            protocol: 'mqtt',
            clientId: `autonomous-backend-client-${randomUUID()}`,
          },
        }),
      },
    ]),
  ],
  providers: [MqttEventBusService],
  exports: [MqttEventBusService],
})
export class MessagingModule {}
