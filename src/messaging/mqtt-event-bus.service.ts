import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MqttEvent } from '@autonomous/shared/types';
import { firstValueFrom } from 'rxjs';
import { MQTT_EVENT_BUS_NAME } from '@autonomous/messaging';

@Injectable()
export class MqttEventBusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttEventBusService.name);

  constructor(
    @Inject(MQTT_EVENT_BUS_NAME) private readonly client: ClientProxy,
  ) {}

  async publish(message: MqttEvent): Promise<void> {
    const { topic, payload } = message;
    return firstValueFrom(this.client.emit(topic, payload));
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
