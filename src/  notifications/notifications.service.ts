import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { JobPost } from '../jobs/interfaces/job-post.interface';

@Injectable()
export class NotificationsService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendNewJobs(jobs: JobPost[]) {
    if (jobs.length === 0) return;

    try {
      console.log('🚀 Intentando enviar email...');
      console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
      console.log(
        '📧 EMAIL_PASS:',
        process.env.EMAIL_PASS ? 'OK' : 'NO DEFINIDO',
      );

      const content = jobs
        .map(
          (job) => `
🔹 ${job.title}
🏢 ${job.company}
📍 ${job.location}
⏰ ${job.publishedAt}
🔗 ${job.url}
------------------------
`,
        )
        .join('\n');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `🚨 Nuevas vacantes (${jobs.length})`,
        text: content,
      });

      console.log('📧 Email enviado con nuevas vacantes');
      console.log('📨 Response:', info.response);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
    }
  }
}
