import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
    });
    task.ownerId = userId;
    return await this.taskRepository.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    return await this.taskRepository.findBy({
      ownerId: userId,
      isDeleted: false,
    });
  }

  async findOne(userId: string, id: string): Promise<Task | null> {
    return await this.taskRepository.findOneBy({
      ownerId: userId,
      id: id,
      isDeleted: false,
    });
  }

  async update(
    userId: string,
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    const task = await this.taskRepository.findOneBy({
      ownerId: userId,
      id: id,
      isDeleted: false,
    });

    if (!task) return null;

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }

    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
    }

    task.updateAt = Date.now();

    return await this.taskRepository.save(task);
  }

  async remove(userId: string, id: string): Promise<Task | null> {
    const task = await this.taskRepository.findOneBy({
      ownerId: userId,
      id: id,
      isDeleted: false,
    });

    if (!task) return null;

    task.isDeleted = true;
    task.updateAt = Date.now();

    return await this.taskRepository.save(task);
  }
}
