import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
// import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const dto: CreateTaskDto = {
    title: 'new task',
    description: 'this is new task',
  };

  const userId: string = 'format-UUID';

  const mockTask = new Task(randomUUID(), dto.title, dto.description);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          // useClass: Repository<Task>,
          useValue: {
            findOneBy: jest.fn(), // Buat cari satu task berdasarkan kondisi
            findBy: jest.fn(), // Buat ambil banyak task (filter)
            findOne: jest.fn(), // Kalau kamu pakai findOne lama
            save: jest.fn(), // Untuk menyimpan task baru / hasil update
            create: jest.fn(), // Untuk membuat entitas baru (tanpa insert DB)
            delete: jest.fn(), // Untuk hapus entitas (soft/hard delete)
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('create should added new task', async () => {
    jest.spyOn(repository, 'create').mockReturnValue(mockTask);

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(mockTask));

    const createTask = await service.create(userId, dto);

    createTask.ownerId = userId;

    expect(createTask).toBe(mockTask);
    expect(createTask.ownerId).toBe(userId);
  });

  it('find All should tasks', async () => {
    jest
      .spyOn(repository, 'findBy')
      .mockImplementation(
        (filtered: { userId: string; isDeleted: boolean }): Promise<Task[]> => {
          expect(filtered.isDeleted).toBe(false);
          return Promise.resolve([mockTask]);
        },
      );

    const result = await service.findAll(userId);
    expect(result).toEqual([mockTask]);
  });

  it('findOne should return the task with given id', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockImplementation(
        (filtered: {
          userId: string;
          id: string;
          isDeleted: boolean;
        }): Promise<Task> => {
          expect(filtered.id).toBe(mockTask.id);
          expect(filtered.isDeleted).toBe(false);
          return Promise.resolve(mockTask);
        },
      );

    const result = await service.findOne(userId, mockTask.id);

    expect(result).toBe(mockTask);
  });

  it('should successfully update the task when id is found', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockImplementation(
        (filtered: {
          userId: string;
          id: string;
          isDeleted: boolean;
        }): Promise<Task> => {
          expect(filtered.id).toBe(mockTask.id);
          expect(filtered.isDeleted).toBe(mockTask.isDeleted);
          return Promise.resolve(mockTask);
        },
      );

    jest
      .spyOn(repository, 'save')
      .mockImplementation((task: Task): Promise<Task> => {
        return Promise.resolve(task);
      });

    const updateTask = await service.update(userId, mockTask.id, {
      title: 'new task update',
      description: 'this is new task has been updated',
      status: 'DONE',
    });

    expect(updateTask?.id).toBe(mockTask.id);
    expect(updateTask?.title).toBe(mockTask.title);
    expect(updateTask?.description).toBe(mockTask.description);
    expect(updateTask?.status).toBe('DONE');
  });

  it('update if should return null when task is not found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    const updateTask = await service.update(userId, 'fakeUUID', {
      title: 'new task update',
      description: 'this is new task has been updated',
      status: 'DONE',
    });

    expect(updateTask).toBeNull();
  });

  it('should successfully delete the task when id is found', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockImplementation(
        (filtered: { id: string; isDeleted: boolean }): Promise<Task> => {
          expect(filtered.id).toBe(mockTask.id);
          expect(filtered.isDeleted).toBe(mockTask.isDeleted);
          return Promise.resolve(mockTask);
        },
      );

    jest
      .spyOn(repository, 'save')
      .mockImplementation((task: Task): Promise<Task> => {
        return Promise.resolve(task);
      });

    const deleteTask = await service.remove(userId, mockTask.id);
    expect(deleteTask?.id).toBe(mockTask.id);
  });

  it('delete if should return null when task is not found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    const deleteTask = await service.remove(userId, 'fakeUUID');
    expect(deleteTask).toBeNull();
  });
});
