import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports : [AuthModule,TasksModule]
})
export class MessagesWsModule {}
