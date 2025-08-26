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

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

import { ValidRoles } from '../auth/interface/valid-roles.interface';
import { GetUser } from '../auth/Decorator';
import { Auth } from '../auth/Decorator/auth-roles.decorator';

import { User } from '../auth/entities/auth.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.tasksService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
