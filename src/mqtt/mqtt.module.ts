import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_SERVICE_NAME } from '@autonomous/mqtt/constants/mqtt.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MQTT_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: configService.getOrThrow<string>('MQTT_URL'),
            username: configService.getOrThrow<string>('MQTT_USERNAME'),
            password: configService.getOrThrow<string>('MQTT_PASSWORD'),
            protocol: 'mqtt',
          },
        }),
      },
    ]),
  ],
})
export class MqttModule {}
