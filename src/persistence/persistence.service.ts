import { Injectable } from '@nestjs/common';
import { JobPost } from '../jobs/interfaces/job-post.interface';

@Injectable()
export class PersistenceService {
  private jobs: JobPost[] = [];

  saveNewJobs(newJobs: JobPost[]): JobPost[] {
    const uniqueJobs: JobPost[] = [];

    newJobs.forEach((job) => {
      const exists = this.jobs.find((j) => j.url === job.url);

      if (!exists) {
        this.jobs.push(job);
        uniqueJobs.push(job);
      }
    });

    return uniqueJobs;
  }

  getAllJobs(): JobPost[] {
    return this.jobs;
  }
}
