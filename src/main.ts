import { NestFactory } from '@nestjs/core';
import { AppModule } from '@autonomous/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: configService.getOrThrow<string>('MQTT_URL'),
      username: configService.getOrThrow<string>('MQTT_USERNAME'),
      password: configService.getOrThrow<string>('MQTT_PASSWORD'),
      clientId: `autonomous-backend-listener-${randomUUID()}`,
      subscribeOptions: {
        qos: 1,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
