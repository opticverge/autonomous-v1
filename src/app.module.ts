import { Module } from '@nestjs/common';
import { AppController } from '@autonomous/app.controller';
import { AppService } from '@autonomous/app.service';
import { ConfigModule } from '@nestjs/config';
import { VehicleModule } from '@autonomous/vehicle/vehicle.module';
import { DatabaseModule } from '@autonomous/database/database.module';
import { MqttModule } from '@autonomous/mqtt/mqtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VehicleModule,
    DatabaseModule,
    MqttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
