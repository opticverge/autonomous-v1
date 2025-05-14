import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  VehicleRepository,
  TelemetryRepository,
} from '@autonomous/database/repositories';
import { Telemetry, Vehicle } from '@autonomous/database/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        port: config.getOrThrow<number>('MONGO_PORT'),
        host: config.getOrThrow<string>('MONGO_HOST'),
        username: config.getOrThrow<string>('MONGO_APP_USERNAME'),
        password: config.getOrThrow<string>('MONGO_APP_PASSWORD'),
        database: config.getOrThrow<string>('MONGO_DATABASE'),
        autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Vehicle, Telemetry]),
  ],
  providers: [VehicleRepository, TelemetryRepository],
  exports: [VehicleRepository, TelemetryRepository],
})
export class DatabaseModule {}
