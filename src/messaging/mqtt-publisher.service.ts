import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MqttMessageTopic, MqttMessagePayload } from '@autonomous/shared/types';
import { firstValueFrom } from 'rxjs';
import { MQTT_PUBLISHER_NAME } from '@autonomous/messaging/messaging.constants';

@Injectable()
export class MqttPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttPublisherService.name);

  constructor(
    @Inject(MQTT_PUBLISHER_NAME) private readonly client: ClientProxy,
  ) {}

  async publish<T extends MqttMessageTopic>(
    topic: T,
    payload: MqttMessagePayload<T>,
  ) {
    await firstValueFrom(this.client.emit(topic, payload));
  }

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to connect to MQTT broker: ${message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
      this.logger.log('Successfully closed connection to MQTT broker');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to close connection to MQTT broker: ${message}`,
      );
      throw error;
    }
  }
}
