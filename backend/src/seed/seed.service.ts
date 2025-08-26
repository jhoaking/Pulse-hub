import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { initialData } from './Data/seed-data';


import { User } from '../auth/entities/auth.entity';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly taskService: TasksService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();

    const adminUser = await  this.insertUsers();

    await this.insertNewTask(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.taskService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const dbUser = await this.userRepository.save(seedUsers);

    return dbUser[0];
  }


  private async insertNewTask(user:User){
    await this.taskService.deleteAllProducts()

    const tasks = initialData.task;

    const insertPromises :Promise<any>[] = []

    tasks.forEach((task) => {
        insertPromises.push(this.taskService.create(task,user))
    })
   await  Promise.all(insertPromises);

   return true
  }
}
