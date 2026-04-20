import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkedinScraper } from './scrapers/linkedin.scraper';
import { JobsFilter } from './filters/jobs.filter';
import { JobPost } from './interfaces/job-post.interface';
import { JobEntity } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    private readonly linkedinScraper: LinkedinScraper,
    private readonly jobsFilter: JobsFilter,
    @InjectRepository(JobEntity)
    private readonly jobsRepository: Repository<JobEntity>,
  ) {}

  async checkJobs(): Promise<JobPost[]> {
    const jobs = await this.linkedinScraper.getJobs();
    const filteredJobs = this.jobsFilter.filterRelevantJobs(jobs);

    const newJobs: JobPost[] = [];

    for (const job of filteredJobs) {
      const exists = await this.jobsRepository.findOne({
        where: { externalId: job.externalId },
      });

      if (!exists) {
        await this.jobsRepository.save(job);
        newJobs.push(job);
      }
    }

    console.log(
      'Vacantes filtradas:',
      filteredJobs.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        publishedAt: job.publishedAt,
        url: job.url,
        externalId: job.externalId,
      })),
    );

    console.log('Total filtradas:', filteredJobs.length);
    console.log('NUEVAS vacantes:', newJobs.length);

    return newJobs;
  }
}
