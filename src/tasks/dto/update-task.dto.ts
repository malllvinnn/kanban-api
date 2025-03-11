import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus, TASK_STATUSES } from 'src/tasks/entities/task.entity';
import { IsIn } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;
}
