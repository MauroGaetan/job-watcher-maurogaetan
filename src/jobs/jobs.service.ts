import { Injectable } from '@nestjs/common';
import { LinkedinScraper } from './scrapers/linkedin.scraper';
import { JobsFilter } from './filters/jobs.filter';
import { JobPost } from './interfaces/job-post.interface';

@Injectable()
export class JobsService {
  constructor(
    private readonly linkedinScraper: LinkedinScraper,
    private readonly jobsFilter: JobsFilter,
  ) {}

  async checkJobs(): Promise<JobPost[]> {
    const jobs = await this.linkedinScraper.getJobs();
    const filteredJobs = this.jobsFilter.filterRelevantJobs(jobs);

    console.log('Vacantes encontradas:', jobs);
    console.log('Vacantes filtradas:', filteredJobs);

    return filteredJobs;
  }
}
