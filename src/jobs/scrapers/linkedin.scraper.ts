import { Injectable } from '@nestjs/common';
import { JobPost } from '../interfaces/job-post.interface';

@Injectable()
export class LinkedinScraper {
  getJobs(): JobPost[] {
    return [
      {
        title: 'Backend Developer Node.js',
        company: 'Tech Corp',
        location: 'Remote',
        url: 'https://linkedin.com/jobs/view/1',
        source: 'LinkedIn',
      },
      {
        title: 'Frontend Developer React',
        company: 'Dev Company',
        location: 'Argentina',
        url: 'https://linkedin.com/jobs/view/2',
        source: 'LinkedIn',
      },
      {
        title: 'NestJS Backend Junior',
        company: 'Startup X',
        location: 'LATAM',
        url: 'https://linkedin.com/jobs/view/3',
        source: 'LinkedIn',
      },
    ];
  }
}
