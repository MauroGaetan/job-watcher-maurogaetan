import { Injectable } from '@nestjs/common';
import { JobPost } from '../interfaces/job-post.interface';

@Injectable()
export class JobsFilter {
  filterRelevantJobs(jobs: JobPost[]): JobPost[] {
    return jobs.filter((job) => {
      const title = job.title.toLowerCase();

      return (
        title.includes('backend') ||
        title.includes('node') ||
        title.includes('nestjs')
      );
    });
  }
}
