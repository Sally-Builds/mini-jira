import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
    tasks: [],
  };

  const createMockQueryBuilder = () => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getMany: jest.fn(),
  });

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => createMockQueryBuilder()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date().toISOString(),
      };

      const task = {
        id: '1',
        ...createTaskDto,
        assigneeId: mockUser.id,
        assignee: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(task);
      mockRepository.save.mockResolvedValue(task);

      const result = await service.create(createTaskDto, mockUser);
      expect(result).toEqual(task);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        assigneeId: mockUser.id,
        dueDate: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const tasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];

      const queryBuilder = createMockQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(tasks);
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll({}, mockUser);
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const task = { id: '1', title: 'Task 1', assigneeId: mockUser.id };
      mockRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne('1', mockUser);
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const task = {
        id: '1',
        title: 'Old Title',
        assigneeId: mockUser.id,
      };

      const updateTaskDto: UpdateTaskDto = {
        title: 'New Title',
      };

      mockRepository.findOne.mockResolvedValue(task);
      mockRepository.save.mockResolvedValue({ ...task, ...updateTaskDto });

      const result = await service.update('1', updateTaskDto, mockUser);
      expect(result.title).toBe(updateTaskDto.title);
    });
  });
});
