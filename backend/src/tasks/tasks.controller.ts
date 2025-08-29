import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { PaginationDto } from '../common/dto/pagination.dto';

import { ValidRoles } from '../auth/interface/valid-roles.interface';
import { GetUser } from '../auth/Decorator';
import { Auth } from '../auth/Decorator/auth-roles.decorator';

import { Task } from './entities/task.entity';
import { User } from '../auth/entities/auth.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiResponse({ status: 201, description: 'task was created', type: Task })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden. token Related' })
  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @ApiResponse({ status: 200, type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden. token Related' })
  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @ApiResponse({ status: 200, type: Task })
  @ApiResponse({ status: 400, description: 'task not found', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden. token Related' })
  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.tasksService.findOne(term);
  }

  @ApiResponse({
    status: 201,
    description: 'task was correctly updated',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'task not found', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden. token Related' })
  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @ApiResponse({ status: 200, description: 'task was correctly deleted' })
  @ApiResponse({ status: 400, description: 'task not found', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden. token Related' })
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
