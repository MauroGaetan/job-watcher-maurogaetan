import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import { JobPost } from '../interfaces/job-post.interface';

@Injectable()
export class LinkedinScraper {
  async getJobs(): Promise<JobPost[]> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(
        'https://www.linkedin.com/jobs/search/?keywords=backend%20node&location=Worldwide',
        { waitUntil: 'domcontentloaded' },
      );

      await page.waitForTimeout(5000);

      const jobs = await page.$$eval('.base-card', (cards) =>
        cards
          .map((card) => {
            const title =
              card
                .querySelector('.base-search-card__title')
                ?.textContent?.trim() || '';

            const company =
              card
                .querySelector('.base-search-card__subtitle')
                ?.textContent?.trim() || '';

            const location =
              card
                .querySelector('.job-search-card__location')
                ?.textContent?.trim() || '';

            const url = card.querySelector('a')?.getAttribute('href') || '';

            const publishedAt =
              card.querySelector('time')?.textContent?.trim() || '';

            const match = url.match(/-(\d+)\?/);
            const externalId = match ? match[1] : url;

            return {
              title,
              company,
              location,
              url,
              source: 'LinkedIn',
              publishedAt,
              externalId,
            };
          })
          .filter((job) => job.title && job.url),
      );

      console.log('Jobs scrapeados:', jobs.length);

      return jobs;
    } catch (error) {
      console.error('Error en scraper LinkedIn:', error);
      return [];
    } finally {
      await browser.close();
    }
  }
}
