import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsScheduler } from './jobs.scheduler';
import { LinkedinScraper } from './scrapers/linkedin.scraper';
import { JobsFilter } from './filters/jobs.filter';
import { JobEntity } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity])],
  providers: [JobsService, JobsScheduler, LinkedinScraper, JobsFilter],
})
export class JobsModule {}
