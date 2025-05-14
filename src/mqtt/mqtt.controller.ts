import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { TelemetryService } from '@autonomous/mqtt/services';
import { VehicleTelemetryDto } from 'src/mqtt/dtos';

@Controller()
export class MqttController {

  constructor(private readonly telemetryService: TelemetryService) {}

  @MessagePattern('vehicle/telemetry')
  async handleVehicleTelemetry(
    @Payload() payload: VehicleTelemetryDto,
    @Ctx() context: MqttContext,
  ) {
    await this.telemetryService.process(payload);
  }
}
