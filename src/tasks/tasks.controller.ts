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
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly tasksService: TasksService) { }

  @Version('1')
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id') id: number) {
    const task = this.tasksService.findOne(id);
    if (task === undefined) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const task = this.tasksService.update(id, updateTaskDto);
    if (task === undefined) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tasksService.remove(id);
  }
}
