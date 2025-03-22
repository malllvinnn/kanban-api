import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from 'src/tasks/entities/task.entity';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find all should returns empty tasks', async () => {
    jest.spyOn(service, 'findAll').mockImplementation(() => [] as Task[]);

    const tasks = await controller.findAll();
    expect(tasks).toHaveLength(0);
  });

  it('find all should returns all tasks', async () => {
    const tasks: Task[] = [
      new Task(randomUUID(), 'task one', 'this is task one'),
      new Task(randomUUID(), 'task two', 'this is task two'),
      new Task(randomUUID(), 'task three', 'this is task three'),
    ];
    jest.spyOn(service, 'findAll').mockImplementation(() => tasks);

    const actual = await controller.findAll();
    expect(actual).toBe(tasks);
  });

  it('findOne should be returns task', () => {
    const task: Task = new Task(randomUUID(), 'task two', 'this is task two');
    jest
      .spyOn(service, 'findOne')
      .mockImplementation((id: string): Task | undefined => {
        expect(id).toBe(task.id);
        return task;
      });
    const actual = controller.findOne(task.id);
    expect(actual).toBe(task);
  });

  it('findOne should be thrown not found expection', () => {
    const mockId = randomUUID();
    jest
      .spyOn(service, 'findOne')
      .mockImplementation((id: string): Task | undefined => {
        expect(id).toBe(mockId);
        return undefined;
      });
    expect(() => controller.findOne(mockId)).toThrow(NotFoundException);
  });

  it('create should be returns task', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'new task',
      description: 'this is new task',
    };
    const createTask: Task = new Task(
      randomUUID(),
      createTaskDto.title,
      createTaskDto.description,
    );
    jest
      .spyOn(service, 'create')
      .mockImplementation((dto: CreateTaskDto): Task => {
        expect(dto).toBe(createTaskDto);
        return createTask;
      });
    const actual = controller.create(createTaskDto);
    expect(actual).toBe(createTask);
  });

  it('update should be returns task', () => {
    const oldTask: Task = new Task(
      randomUUID(),
      'new task',
      'this is new task',
    );
    const updateTaskDto: UpdateTaskDto = {
      title: 'new task update',
      description: 'this is new task has been updated',
      status: 'TODO',
    };
    const updatedTask = { ...oldTask, ...updateTaskDto };

    jest
      .spyOn(service, 'update')
      .mockImplementation(
        (id: string, dto: UpdateTaskDto): Task | undefined => {
          expect(id).toBe(oldTask.id);
          expect(dto).toBe(updateTaskDto);
          return updatedTask;
        },
      );
    const actual = controller.update(oldTask.id, updateTaskDto);
    expect(actual).toBe(updatedTask);
  });

  it('update should be thrown not found expection', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'new task',
      description: 'this is new task',
      status: 'TODO',
    };

    jest.spyOn(service, 'update').mockImplementation((): Task | undefined => {
      return undefined;
    });

    expect(() => controller.update('fakeUUID', updateTaskDto)).toThrow(
      NotFoundException,
    );
  });

  it('delete should be returns task', () => {
    const task: Task = new Task(randomUUID(), 'new task', 'this is new task');

    jest.spyOn(service, 'remove').mockImplementation((id: string): Task => {
      expect(id).toBe(task.id);
      return task;
    });

    const actual = controller.remove(task.id);
    expect(actual).toBe(task);
  });
});
