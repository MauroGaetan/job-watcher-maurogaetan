import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsScheduler } from './jobs.scheduler';
import { LinkedinScraper } from './scrapers/linkedin.scraper';
import { JobsFilter } from './filters/jobs.filter';
import { JobEntity } from './entities/job.entity';
import { NotificationsModule } from '../  notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity]), NotificationsModule],
  providers: [JobsService, JobsScheduler, LinkedinScraper, JobsFilter],
})
export class JobsModule {}
