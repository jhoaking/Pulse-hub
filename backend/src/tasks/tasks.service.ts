import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { User } from 'src/auth/entities/auth.entity';
import { Status } from './types/task';

@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const { duration, ...rest } = createTaskDto;

    const now = new Date();
    const dueDate = new Date(now);

    const match = duration.match(/^(\d+)([mhd])$/);
    if (!match) throw new Error('duration invalid');

    const value = parseInt(match[1], 10); // el valor en numero de al duracion
    const unit = match[2]; // sacamos el valor de la unidad como 'h' 'm' 's'

    switch (unit) {
      case 'm':
        dueDate.setMinutes(dueDate.getMinutes() + value);
        break;
      case 'h':
        dueDate.setHours(dueDate.getHours() + value);
        break;
      case 'd':
        dueDate.setDate(dueDate.getDate() + value);
        break;
    }

    try {
      const task = this.taskRepository.create({
        ...rest,
        dueDate,
        duration,
        user,
      });

      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      console.log(error);

      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const task = await this.taskRepository.find({
      take: limit,
      skip: offset,
    });
    return task.map((tasks) => ({
      ...tasks,
    }));
  }

  async findOne(term: string) {
    let task: Task | null = null;

    if (isUUID(term)) {
      task = await this.taskRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.taskRepository.createQueryBuilder('tas');
      task = await queryBuilder
        .where('name =:name or duration =:duration', {
          name: term,
          duration: term,
        })
        .getOne();
    }

    if (!task) throw new NotFoundException(`task with ${term} not found`);

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const { isCompleted, ...toUpdate } = updateTaskDto;

    const task = await this.taskRepository.preload({
      id,
      ...toUpdate,
    });

    if (!task) throw new NotFoundException(`task with ${id} not found `);

    const now = new Date();
    try {
      if (isCompleted) {
        task.isCompleted = true;
        task.status = Status.completed;
        task.user = user;
      } else {
        if (now > task.dueDate && !task.isCompleted) {
          task.status = Status.delayed;
        }
      }

      return await this.taskRepository.save(task);
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'unexpected error check server logs!',
    );
  }

  async deleteAllProducts() {
    const query = this.taskRepository.createQueryBuilder('tasks');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {}
  }
}
