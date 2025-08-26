import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import {ScheduleModule} from '@nestjs/schedule'


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type : 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    TasksModule,
    CommonModule,
    SeedModule,
    MessagesWsModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
