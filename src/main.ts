import { NestFactory } from '@nestjs/core';
import { AppModule } from '@autonomous/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { GlobalExceptionsFilter } from '@autonomous/common/filter/global-exceptions.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: [
        configService.getOrThrow<string>('MQTT_PROTOCOL'),
        '://',
        configService.getOrThrow<string>('MQTT_HOST'),
        ':',
        configService.getOrThrow<number>('MQTT_PORT'),
      ].join(''),
      username: configService.getOrThrow<string>('MQTT_USERNAME'),
      password: configService.getOrThrow<string>('MQTT_PASSWORD'),
      clientId: `autonomous-backend-listener-${randomUUID()}`,
      protocolVersion: 5,
      subscribeOptions: {
        qos: 1,
      },
    },
  });

  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  app.useGlobalFilters(new GlobalExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Autonomous API')
    .setDescription('API documentation for Autonomous backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
