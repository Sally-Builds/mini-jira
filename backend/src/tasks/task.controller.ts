import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.create(createTaskDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  findAll(@Query() filterDto: FilterTaskDto, @GetUser() user: User) {
    return this.taskService.findAll(filterDto, user);
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Get all tasks statuses' })
  getAllStatuses() {
    return this.taskService.getTaskStatuses();
  }

  @Get('priorities')
  @ApiOperation({ summary: 'Get all tasks priorities' })
  getAllPriorities() {
    return this.taskService.getTaskPriorities();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task' })
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.remove(id, user);
  }
}
