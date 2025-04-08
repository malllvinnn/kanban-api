import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from 'src/tasks/entities/task.entity';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRequest } from 'src/auth/request/auth';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const req: AuthRequest = {
    authenticateUser: {
      id: 'format-UUID',
    },
  } as unknown as AuthRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useClass: Repository<Task> },
      ],
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
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve([] as Task[]));

    const tasks = await controller.findAll(req);
    expect(tasks).toHaveLength(0);
  });

  it('find all should returns all tasks', async () => {
    const tasks: Task[] = [
      new Task(randomUUID(), 'task one', 'this is task one'),
      new Task(randomUUID(), 'task two', 'this is task two'),
      new Task(randomUUID(), 'task three', 'this is task three'),
    ];
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(tasks));

    const actual = await controller.findAll(req);
    expect(actual).toBe(tasks);
  });

  it('findOne should be returns task', async () => {
    const task: Task = new Task('format-UUID', 'task two', 'this is task two');
    task.ownerId = 'format-UUID';

    jest
      .spyOn(service, 'findOne')
      .mockImplementation((id: string): Promise<Task | null> => {
        expect(id).toBe(task.id);
        return Promise.resolve(task);
      });
    const actual = await controller.findOne(req, task.id);
    expect(actual).toBe(task);
  });

  it('findOne should be thrown not found expection', async () => {
    const mockId = 'format-UUID';
    jest
      .spyOn(service, 'findOne')
      .mockImplementation((id: string): Promise<Task | null> => {
        expect(id).toBe(mockId);
        return Promise.resolve(null);
      });
    await expect(controller.findOne(req, mockId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('create should be returns task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'new task',
      description: 'this is new task',
    };
    const createTask: Task = new Task(
      randomUUID(),
      createTaskDto.title,
      createTaskDto.description,
    );

    createTask.ownerId = 'format-UUID';

    jest
      .spyOn(service, 'create')
      .mockImplementation(
        (userId: string = 'format-UUID', dto: CreateTaskDto): Promise<Task> => {
          expect(userId).toBe(createTask.ownerId);
          expect(dto).toBe(createTaskDto);
          return Promise.resolve(createTask);
        },
      );
    const actual = await controller.create(req, createTaskDto);
    expect(actual).toBe(createTask);
  });

  it('update should be returns task', async () => {
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
        (
          userId: string = 'format-UUID',
          id: string,
          dto: UpdateTaskDto,
        ): Promise<Task | null> => {
          expect(userId).toBe('format-UUID');
          expect(id).toBe(oldTask.id);
          expect(dto).toBe(updateTaskDto);
          return Promise.resolve(updatedTask);
        },
      );
    const actual = await controller.update(req, oldTask.id, updateTaskDto);
    expect(actual).toBe(updatedTask);
  });

  it('update should be thrown not found expection', async () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'new task',
      description: 'this is new task',
      status: 'TODO',
    };

    jest
      .spyOn(service, 'update')
      .mockImplementation((): Promise<Task | null> => {
        return Promise.resolve(null);
      });

    await expect(
      controller.update(req, 'fakeUUID', updateTaskDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('delete should be returns task', async () => {
    const task: Task = new Task('format-UUID', 'new task', 'this is new task');

    jest
      .spyOn(service, 'remove')
      .mockImplementation((id: string): Promise<Task | null> => {
        expect(id).toBe(task.id);
        return Promise.resolve(task);
      });

    const actual = await controller.remove(req, task.id);
    expect(actual).toBe(task);
  });

  it('delete should be throw not found expection', async () => {
    jest
      .spyOn(service, 'remove')
      .mockImplementation((id: string): Promise<Task | null> => {
        expect(id).toBe('format-UUID');
        return Promise.resolve(null);
      });

    await expect(controller.remove(req, 'format-UUID')).rejects.toThrow(
      NotFoundException,
    );
  });
});
