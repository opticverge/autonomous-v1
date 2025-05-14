import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MQTT_SERVICE_NAME } from '@autonomous/mqtt/mqtt.constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);

  constructor(
    @Inject(MQTT_SERVICE_NAME) private readonly client: ClientProxy,
  ) {}

  async emit(topic: any, data: any): Promise<void> {
    return firstValueFrom(this.client.emit(topic, data));
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
