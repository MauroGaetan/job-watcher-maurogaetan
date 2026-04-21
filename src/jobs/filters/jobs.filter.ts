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
        title.includes('nestjs') ||
        title.includes('javascript') ||
        title.includes('typescript') ||
        title.includes('api');

      const isSenior =
        title.includes('senior') ||
        title.includes('sr') ||
        title.includes('staff') ||
        title.includes('principal') ||
        title.includes('lead') ||
        title.includes('architect');

      const isArgentina =
        location.includes('argentina') ||
        location.includes('buenos aires') ||
        location.includes('caba');

      const isRemote =
        title.includes('remote') ||
        title.includes('remoto') ||
        location.includes('remote') ||
        location.includes('remoto') ||
        location.includes('worldwide') ||
        location.includes('latam') ||
        location.includes('latin america');

      const matchesLocation = isArgentina || isRemote;

      const isJustNow =
        publishedAt.includes('just now') || publishedAt.includes('moments ago');

      const minutesMatch = publishedAt.match(
        /(\d+)\s*(minute|minutes|min|mins)/,
      );
      const minutes = minutesMatch ? Number(minutesMatch[1]) : null;

      const isRecent = isJustNow || (minutes !== null && minutes <= 40);

      return includesTech && !isSenior && matchesLocation && isRecent;
    });
  }
}
