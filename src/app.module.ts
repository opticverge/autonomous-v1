import { Module } from '@nestjs/common';
import { AppController } from '@autonomous/app.controller';
import { AppService } from '@autonomous/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@autonomous/database/database.module';
import { MqttModule } from '@autonomous/mqtt/mqtt.module';
import { JwtModule } from '@nestjs/jwt';
import { MessagingModule } from '@autonomous/messaging/messaging.module';
import { MissionModule } from '@autonomous/mission/mission.module';
import { VehicleMissionModule } from '@autonomous/vehicle-mission/vehicle-mission.module';
import { VehicleModule } from '@autonomous/vehicle/vehicle.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventModule } from './event/event.module';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
    }),
    DatabaseModule,
    MessagingModule,
    MqttModule,
    VehicleModule,
    MissionModule,
    VehicleMissionModule,
    EventModule,
    TelemetryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
