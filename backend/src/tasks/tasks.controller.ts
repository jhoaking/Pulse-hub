import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetUser } from 'src/auth/Decorator';
import { User } from 'src/auth/entities/auth.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() paginationDto : PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.tasksService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id' ,ParseUUIDPipe) id: string,
     @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user : User) {
    return this.tasksService.update(id, updateTaskDto , user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string
) {
    return this.tasksService.remove(id);
  }
}
