import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  @Cron('*/1 * * * *') // cada 1 minuto
  handleCron() {
    console.log('⏰ Buscando nuevas vacantes...');
  }
}
