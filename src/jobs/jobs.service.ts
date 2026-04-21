import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkedinScraper } from './scrapers/linkedin.scraper';
import { JobsFilter } from './filters/jobs.filter';
import { JobPost } from './interfaces/job-post.interface';
import { JobEntity } from './entities/job.entity';
import { NotificationsService } from '../  notifications/notifications.service';

@Injectable()
export class JobsService {
  private isRunning = false;

  constructor(
    private readonly linkedinScraper: LinkedinScraper,
    private readonly jobsFilter: JobsFilter,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(JobEntity)
    private readonly jobsRepository: Repository<JobEntity>,
  ) {}

  async checkJobs(): Promise<JobEntity[]> {
    if (this.isRunning) {
      console.log('⛔ Ya hay un scraping en ejecución');
      return [];
    }

    this.isRunning = true;

    try {
      const jobs = await this.linkedinScraper.getJobs();
      console.log('🔎 Jobs scrapeados:', jobs.length);

      console.log(
        '🧪 Muestra jobs scrapeados:',
        jobs.slice(0, 10).map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
          publishedAt: job.publishedAt,
          source: job.source,
        })),
      );

      const filteredJobs = this.jobsFilter.filterRelevantJobs(jobs);
      console.log('✅ Jobs filtrados:', filteredJobs.length);

      const newJobs: JobEntity[] = [];
      let existingCount = 0;

      for (const job of filteredJobs) {
        const savedJob = await this.saveJobIfNotExists(job);

        if (savedJob) {
          newJobs.push(savedJob);
        } else {
          existingCount++;
        }
      }

      console.log('♻️ Jobs ya existentes en DB:', existingCount);
      console.log('🆕 Jobs nuevos:', newJobs.length);

      console.log(
        'Vacantes nuevas:',
        newJobs.map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
          publishedAt: job.publishedAt,
          url: job.url,
          externalId: job.externalId,
        })),
      );

      if (newJobs.length > 0) {
        console.log('📨 Voy a enviar email...');

        await this.notificationsService.sendNewJobs(
          newJobs.map((job) => ({
            title: job.title,
            company: job.company,
            location: job.location,
            url: job.url,
            publishedAt: job.publishedAt,
            externalId: job.externalId,
            source: job.source,
          })),
        );

        for (const job of newJobs) {
          job.sent = true;
          await this.jobsRepository.save(job);
        }

        console.log('✅ Emails enviados:', newJobs.length);
      } else {
        console.log('📭 No hay jobs nuevos para enviar');
      }

      return newJobs;
    } finally {
      this.isRunning = false;
    }
  }

  async saveJobIfNotExists(jobData: JobPost): Promise<JobEntity | null> {
    const existing = await this.jobsRepository.findOne({
      where: { externalId: jobData.externalId },
    });

    if (existing) {
      return null;
    }

    const newJob = this.jobsRepository.create({
      ...jobData,
      sent: false,
    });

    return await this.jobsRepository.save(newJob);
  }
}
