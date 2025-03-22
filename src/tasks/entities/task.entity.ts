import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const TASK_STATUSES = [
  'TODO',
  'ON_PROGRESS',
  'DONE',
  'ACRHIVED',
  'INVALID',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'enum', enum: TASK_STATUSES, default: 'TODO' })
  status: TaskStatus;

  @Column({ type: 'bigint', nullable: false })
  ownerId: number;

  @Column({ type: 'bigint', nullable: false, name: 'create_at' })
  createAt: number; // unix timestamp

  @Column({ type: 'bigint', nullable: false, name: 'update_at' })
  updateAt: number; // unix timestamp

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  constructor(id: string, title: string, description: string) {
    const timestamp = Date.now();
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = 'TODO';
    this.ownerId = -1;
    this.createAt = timestamp;
    this.updateAt = timestamp;
    this.isDeleted = false;
  }
}
