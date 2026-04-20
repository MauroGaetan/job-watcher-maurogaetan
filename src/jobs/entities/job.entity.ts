import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column()
  url: string;

  @Column()
  source: string;

  @Column()
  publishedAt: string;

  @Column({ unique: true })
  externalId: string;
}
