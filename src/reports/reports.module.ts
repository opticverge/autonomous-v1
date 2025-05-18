import { Module } from '@nestjs/common';
import { DatabaseModule } from '@autonomous/database/database.module';
import { ReportsController } from '@autonomous/reports/reports.controller';
import { ReportsService } from '@autonomous/reports/reports.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
