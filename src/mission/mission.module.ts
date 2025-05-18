import { Module } from '@nestjs/common';
import { MissionController } from '@autonomous/mission/mission.controller';
import { MissionService } from '@autonomous/mission/mission.service';
import { DatabaseModule } from '@autonomous/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MissionController],
  providers: [MissionService],
  exports: [MissionService],
})
export class MissionModule {}
