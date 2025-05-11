import { Module } from '@nestjs/common';
import { AppController } from '@autonomous/app.controller';
import { AppService } from '@autonomous/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
