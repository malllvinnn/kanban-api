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
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthRequest } from 'src/auth/request/auth';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Version('1')
  @Post()
  async create(@Req() req: AuthRequest, @Body() createTaskDto: CreateTaskDto) {
    console.log(req.authenticateUser);
    return await this.tasksService.create(
      req.authenticateUser.id,
      createTaskDto,
    );
  }

  @Version('1')
  @Get()
  async findAll(@Req() req: AuthRequest) {
    return await this.tasksService.findAll(req.authenticateUser.id);
  }

  @Version('1')
  @Get(':id')
  async findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    const task = await this.tasksService.findOne(req.authenticateUser.id, id);
    if (!task) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(
      req.authenticateUser.id,
      id,
      updateTaskDto,
    );
    if (!task) throw new NotFoundException('task not found');
    return task;
  }

  @Version('1')
  @Delete(':id')
  async remove(@Req() req: AuthRequest, @Param('id') id: string) {
    const task = await this.tasksService.remove(req.authenticateUser.id, id);
    if (!task) throw new NotFoundException('task not found');
    return task;
  }
}
