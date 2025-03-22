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
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Version('1')
  @Get()
  async findAll() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Test untuk Timeout Interceptor
    return this.tasksService.findAll();
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const task = this.tasksService.findOne(id);
    if (task === undefined) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = this.tasksService.update(id, updateTaskDto);
    if (task === undefined) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
