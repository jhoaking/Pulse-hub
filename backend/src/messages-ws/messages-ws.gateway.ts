import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { TasksService } from '../tasks/tasks.service';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';

import { JwtPayload } from '../auth/interface';

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

      //unimos el socket por cada rol a un room
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

  handleError(client: Socket, message: string, error?: any) {
    client.emit('error', { message });

    console.error(
      `[WS ERROR] Client: ${client.id} - ${message}`,
      error ? error : '',
    );
  }

  //chat

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    if (!this.messagesWsService.hasRole(client.id, 'admin')) {
      return this.handleError(
        client,
        'no tienes permiso para mandar mensajes globales',
      );
    }

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message',
    });
  }

  @SubscribeMessage('create-task')
  async handleCreateTask(client: Socket, payload: CreateTaskDto) {
    if (!this.messagesWsService.hasRole(client.id, 'admin')) {
      return this.handleError(client, 'Solo admin puede crear tareas');
    }

    const user = this.messagesWsService.getUserByClient(client.id);

     await this.taskService.create(payload, user);

    this.messagesWsService.emitTaskByRole('employee');
    this.messagesWsService.emitTaskByRole('user');
  }

  //marcar tarea como completada
  @SubscribeMessage('update-task')
  async handleUpdateTask(
    client: Socket,
    payload: { taskId: string; content: CreateTaskDto },
  ) {
    try {
      const user = this.messagesWsService.getUserByClient(client.id);
      const updateDto: UpdateTaskDto = {
        isCompleted: payload.content.isCompleted ?? true,
        ...payload.content,
      };

      const task = await this.taskService.update(
        payload.taskId,
        updateDto,
        user,
      );

      ['admin', 'employee', 'user'].forEach((role) =>
        this.messagesWsService.emitToRole(role, 'task-updated', task),
      );
    } catch (error) {
      this.handleError(client, 'Error al actualizar la tarea');
    }
  }
  //  Eliminar tarea (solo admin)
  @SubscribeMessage('deleted-task')
  async handleDeletedTask(
    client: Socket,
    payload: { taskId: string; name: string },
  ) {
    if (!this.messagesWsService.hasRole(client.id, 'admin')) {
      return this.handleError(client, 'Solo admin puede eliminar tareas');
    }
    const task = await this.taskService.findOne(payload.taskId);

    if (!task) this.handleError(client, 'task not found');

    await this.taskService.remove(payload.taskId);
    this.wss.emit('task-deleted', { id: task.id, name: task.name });
  }
}
