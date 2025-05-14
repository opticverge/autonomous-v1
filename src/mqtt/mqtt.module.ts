import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT_SERVICE_NAME } from '@autonomous/mqtt/mqtt.constants';
import { randomUUID } from 'crypto';
import { MqttService } from '@autonomous/mqtt/mqtt.service';
import { MqttController } from '@autonomous/mqtt/mqtt.controller';
import { TelemetryService } from '@autonomous/mqtt/services';
import { DatabaseModule } from '@autonomous/database/database.module';

@Module({
  imports: [
    DatabaseModule,
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
            clientId: `autonomous-backend-client-${randomUUID()}`,
          },
        }),
      },
    ]),
  ],
  providers: [MqttService, TelemetryService],
  controllers: [MqttController],
})
export class MqttModule {}
