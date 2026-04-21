import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobsService } from './jobs.service';

@Injectable()
export class JobsScheduler {
  constructor(private readonly jobsService: JobsService) {}

  @Cron('*/5 * * * *')
  async handleCron() {
    console.log('⏰ Ejecutando búsqueda de vacantes...');
    await this.jobsService.checkJobs();
  }
}
