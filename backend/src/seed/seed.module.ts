import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports : [TasksModule,AuthModule]
})
export class SeedModule {}
