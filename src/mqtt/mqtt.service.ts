import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MQTT_SERVICE_NAME } from '@autonomous/mqtt/constants/mqtt.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);

  constructor(
    @Inject(MQTT_SERVICE_NAME) private readonly client: ClientProxy,
  ) {}

  async onModuleDestroy() {
    try {
      await this.client.close();
      this.logger.log('Successfully closed connection to MQTT broker');
    } catch (error) {
      this.logger.error(
        `Failed to close connection to MQTT broker: ${error.message}`,
      );
      throw error;
    }
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Successfully connected to MQTT broker');
    } catch (error) {
      this.logger.error(`Failed to connect to MQTT broker: ${error.message}`);
      throw error;
    }
  }
}
