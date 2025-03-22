import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should added new task', () => {
    const dto: CreateTaskDto = {
      title: 'new task',
      description: 'this is new task',
    };

    const initialLength = service.findAll().length;
    const task = service.create(dto);

    expect(task.id).toBeDefined();
    expect(typeof task.id).toBe('string');
    expect(task.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(task.title).toBe(dto.title);
    expect(task.description).toBe(dto.description);
    expect(task.isDeleted).toBe(false);
    expect(service.findAll()).toHaveLength(initialLength + 1);
  });

  it('findOne should return the task with given id', () => {
    const dto: CreateTaskDto = {
      title: 'new task',
      description: 'this is new task',
    };

    const createTask = service.create(dto);
    const foundTask = service.findOne(createTask.id);

    expect(foundTask).toBeDefined();
    expect(foundTask?.id).toBe(createTask.id);
    expect(foundTask?.title).toBe(createTask.title);
    expect(foundTask?.description).toBe(createTask.description);
  });

  it('should successfully update the task when id is found', () => {
    const dto: CreateTaskDto = {
      title: 'new task',
      description: 'this is new task',
    };

    const createTask = service.create(dto);
    const updateTask = service.update(createTask.id, {
      title: 'new task update',
      description: 'this is new task has been updated',
      status: 'DONE',
    });
    expect(updateTask?.id).toBe(createTask.id);
    expect(updateTask?.title).toBe('new task update');
    expect(updateTask?.description).toBe('this is new task has been updated');
    expect(updateTask?.status).toBe('DONE');
  });

  it('should successfully delete the task when id is found', () => {
    const dto: CreateTaskDto = {
      title: 'new task',
      description: 'this is new task',
    };

    const createTask = service.create(dto);
    const deleteTask = service.remove(createTask.id);
    expect(deleteTask.id).toBe(createTask.id);
  });

  it('should throw NotFoundException if task id does not exist', () => {
    expect(() => service.remove('fakeUUID')).toThrow(NotFoundException);
  });
});
