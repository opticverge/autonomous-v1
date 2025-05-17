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

@Module({
  imports: [
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
    MissionModule,
    VehicleMissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
