import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Version('1')
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Version('1')
  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Version('1')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksService.update(id, updateTaskDto);
    if (!task) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const task = await this.tasksService.remove(id);
    if (!task) throw new NotFoundException('task not found');
    return task;
  }
}
