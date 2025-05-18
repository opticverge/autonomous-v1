import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@autonomous/common/guards';
import { ReportsService } from '@autonomous/reports/reports.service';

@UseGuards(JwtGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('missions')
  async getMissionReports() {
    return await this.reportsService.getMissionReports();
  }
}
