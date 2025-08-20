import { Injectable, NotFoundException } from '@nestjs/common';
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
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
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
      });

      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      console.log(error);
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

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    const now = new Date();
    try {
      if (isCompleted) {
        task.isCompleted = true;
        task.status = Status.delayed;
      } else {
        if (now > task.dueDate && !task.isCompleted) {
          task.status = Status.delayed;
        }
      }

      return await this.taskRepository.save(task);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
