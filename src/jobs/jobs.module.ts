import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsScheduler } from './jobs.scheduler';
import { LinkedinScraper } from './scrapers/linkedin.scraper';
import { JobsFilter } from './filters/jobs.filter';

@Module({
  providers: [JobsService, JobsScheduler, LinkedinScraper, JobsFilter],
})
export class JobsModule {}
