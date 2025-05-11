import { Module } from '@nestjs/common';
import { AppController } from '@autonomous/app.controller';
import { AppService } from '@autonomous/app.service';
import { ConfigModule } from '@nestjs/config';
import { VehicleModule } from '@autonomous/vehicle/vehicle.module';
import { DatabaseModule } from '@autonomous/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VehicleModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
