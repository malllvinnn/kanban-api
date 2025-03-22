export const TASK_STATUSES = [
  'TODO',
  'ON_PROGRESS',
  'DONE',
  'ACRHIVED',
  'INVALID',
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export class Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  ownerId: number;
  createAt: number; // unix timestamp
  updateAt: number; // unix timestamp
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
