import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interface';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { TasksService } from 'src/tasks/tasks.service';
import { User } from 'src/auth/entities/auth.entity';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
    private readonly taskService: TasksService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.auth.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.messagesWsService.registerClient(
        client,
        payload.id,
      );

      //unimos el socket por acda rol a un room
      user.roles.forEach((role) => client.join(role));

      this.wss.emit(
        'clients-updated',
        this.messagesWsService.getConnectedClients(),
      );
    } catch (error) {
      client.disconnect();
      return;
    }
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  //chat

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    if (!this.messagesWsService.hasRole(client.id, 'admin')) {
      client.emit('error', {
        message: 'No tienes permisos para mandar mensajes globales',
      });
      return;
    }

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message',
    });
  }

  @SubscribeMessage('create-task')
  handleCreateTask(client: Socket, payload: CreateTaskDto) {
    if (!this.messagesWsService.hasRole(client.id, 'admin')) {
      client.emit('error', { message: 'Solo admin puede crear tareas' });
      return;
    }

    const user = this.messagesWsService.getUserByClient(client.id);

    const task = this.taskService.create(payload, user);

    this.wss.to('employe').emit('task-created', task);
  }

  //marcar tarea como completada
  @SubscribeMessage('update-task')
  async handleUpdateTask(client: Socket, taskId: string, payload: any) {
    const user = this.messagesWsService.getUserByClient(client.id);

    const task = await this.taskService.update(
      payload.taskId,
      { isCompleted: true },
      user,
    );

    this.wss.to('admin').emit('task-updated', task);
  }
  //  Eliminar tarea (solo admin)
  @SubscribeMessage('deleted-task')
  async handleDeletedTask(client: Socket, payload: { taskId: string }) {
    if (!this.messagesWsService.hasRole(client.id, 'admin')) {
      client.emit('error', { message: 'Solo admin puede eliminar tareas' });
      return;
    }
    await this.taskService.remove(payload.taskId);

    this.wss.to('employee').emit('task-deleted', { id: payload.taskId });
  }
}
