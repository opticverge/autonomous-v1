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
import { CreateVehicleDto, UpdateVehicleDto } from '@autonomous/vehicle/dtos';
import { VehicleService } from '@autonomous/vehicle/vehicle.service';

@UseGuards(JwtGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto) {
    return await this.vehicleService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.vehicleService.find(id);
  }

  @Get()
  async findAll() {
    return await this.vehicleService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    await this.vehicleService.update(id, dto);
  }
}
