import { Injectable } from '@nestjs/common';
import { JobPost } from '../interfaces/job-post.interface';

@Injectable()
export class JobsFilter {
  filterRelevantJobs(jobs: JobPost[]): JobPost[] {
    return jobs.filter((job) => {
      const title = job.title.toLowerCase();
      const location = job.location.toLowerCase();
      const publishedAt = job.publishedAt.toLowerCase();

      const includesTech =
        title.includes('backend') ||
        title.includes('back-end') ||
        title.includes('node') ||
        title.includes('nodejs') ||
        title.includes('nestjs');

      const isSenior =
        title.includes('senior') ||
        title.includes('sr') ||
        title.includes('staff') ||
        title.includes('principal') ||
        title.includes('lead');

      const isArgentina =
        location.includes('argentina') || location.includes('buenos aires');

      const isRemote =
        title.includes('remote') ||
        title.includes('remoto') ||
        location.includes('remote') ||
        location.includes('remoto');

      // Argentina: cualquier modalidad
      // Resto del mundo: solo remoto
      const matchesLocation = isArgentina || isRemote;

      // máximo 24 hs
      const isRecent =
        publishedAt.includes('minute') ||
        publishedAt.includes('minutes') ||
        publishedAt.includes('hour') ||
        publishedAt.includes('hours') ||
        publishedAt.includes('just now') ||
        publishedAt.includes('moments ago') ||
        publishedAt === '1 day ago' ||
        publishedAt === '1d' ||
        publishedAt === '24h';

      return includesTech && !isSenior && matchesLocation && isRecent;
    });
  }
}
