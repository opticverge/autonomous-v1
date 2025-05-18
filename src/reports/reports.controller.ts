import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@autonomous/common/guards';
import { ReportsService } from '@autonomous/reports/reports.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: 'report', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get mission reports' })
  @ApiResponse({
    status: 200,
    description: 'Returns a report of all missions and their assigned vehicles',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('missions')
  async getMissionReports() {
    return await this.reportsService.getMissionReports();
  }
}
