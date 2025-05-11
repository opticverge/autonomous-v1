import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url: config.getOrThrow<string>('MONGO_URI'),
        username: config.getOrThrow<string>('MONGO_USERNAME'),
        password: config.getOrThrow<string>('MONGO_PASSWORD'),
        database: config.getOrThrow<string>('MONGO_DATABASE'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
      }),
    }),
  ],
})
export class DatabaseModule {}
