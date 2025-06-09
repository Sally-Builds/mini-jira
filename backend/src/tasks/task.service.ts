import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskPriority } from '../common/enums/task-priority.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      assigneeId: user.id,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
    });

    return await this.taskRepository.save(task);
  }

  async findAll(filterDto: FilterTaskDto, user: User): Promise<Task[]> {
    const query = this.buildFilterQuery(filterDto, user);
    return await query.orderBy('task.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, assigneeId: user.id },
      relations: ['assignee'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    // Update task properties
    Object.assign(task, {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : task.dueDate,
    });

    return await this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
  }

  async updateStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    task.status = status;
    return await this.taskRepository.save(task);
  }

  async getOverdueTasks(user: User): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('task')
      .where('task.assigneeId = :userId', { userId: user.id })
      .andWhere('task.dueDate < :now', { now: new Date() })
      .andWhere('task.status != :doneStatus', { doneStatus: TaskStatus.DONE })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }

  async getTaskPriorities(): Promise<string[]> {
    return Object.values(TaskPriority);
  }

  async getTaskStatuses(): Promise<string[]> {
    return Object.values(TaskStatus);
  }

  private buildFilterQuery(
    filterDto: FilterTaskDto,
    user: User,
  ): SelectQueryBuilder<Task> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .where('task.assigneeId = :userId', { userId: user.id });

    if (filterDto.status) {
      query.andWhere('task.status = :status', { status: filterDto.status });
    }

    if (filterDto.priority) {
      query.andWhere('task.priority = :priority', {
        priority: filterDto.priority,
      });
    }

    if (filterDto.search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${filterDto.search}%` },
      );
    }

    return query;
  }
}
