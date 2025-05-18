import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@autonomous/common/guards';
import { TelemetryService } from '@autonomous/telemetry/telemetry.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Telemetry')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: 'telemetry', version: '1' })
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @ApiOperation({ summary: 'Get telemetry data by vehicle ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the telemetry data for the specified vehicle ID',
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('vehicle/:id')
  async findByVehicleId(@Param('id') id: string) {
    return await this.telemetryService.findByVehicleId(id);
  }
}
