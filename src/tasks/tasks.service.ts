import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 4,
      title: 'Task 4',
      description: 'This is Task 4',
      status: 'TODO',
      ownerId: -1,
      createAt: Date.now(),
      updateAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'This is Task 3',
      status: 'TODO',
      ownerId: -1,
      createAt: Date.now(),
      updateAt: Date.now(),
      isDeleted: false,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'This is Task 4',
      status: 'TODO',
      ownerId: -1,
      createAt: Date.now(),
      updateAt: Date.now(),
      isDeleted: true,
    },
  ];

  create(createTaskDto: CreateTaskDto) {
    const nextId = Math.max(...this.tasks.map((t) => t.id)) + 1;

    const task = new Task(
      nextId,
      createTaskDto.title,
      createTaskDto.description,
    );

    this.tasks.push(task);

    return task;
  }

  findAll() {
    return this.tasks.filter((task) => !task.isDeleted);
  }

  findOne(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id && !t.isDeleted);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(id);
    if (task !== undefined) {
      if (updateTaskDto.status) {
        task.status = updateTaskDto.status;
      }

      if (updateTaskDto.title) {
        task.title = updateTaskDto.title;
      }

      if (updateTaskDto.description) {
        task.description = updateTaskDto.description;
      }

      task.updateAt = Date.now();
    }
    return task;
  }

  remove(id: number) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id && !t.isDeleted);
    if (taskIndex < 0) throw new NotFoundException(`Id ${id} Not Found`);
    this.tasks[taskIndex].isDeleted = true;
    this.tasks[taskIndex].updateAt = Date.now();
    return this.tasks[taskIndex];
  }
}
