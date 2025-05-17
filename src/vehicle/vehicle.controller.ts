import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@autonomous/common/guards';
import { CreateVehicleDto } from '@autonomous/vehicle/dtos';
import { VehicleService } from '@autonomous/vehicle/vehicle.service';

@UseGuards(JwtGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async createVehicle(@Body() dto: CreateVehicleDto) {
    return await this.vehicleService.create(dto);
  }

  @Get(':id')
  async getVehicle(@Param('id') id: string) {
    return await this.vehicleService.find(id);
  }

  @Get()
  async getVehicles() {
    return await this.vehicleService.findAll();
  }

  @Patch(':id')
  async updateVehicle(@Param('id') id: string, @Body() dto: CreateVehicleDto) {
    await this.vehicleService.update(id, dto);
  }
}
