import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Socket } from 'socket.io';

import { User } from '../auth/entities/auth.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { Cron } from '@nestjs/schedule';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly taskService: TasksService,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('user not found');
    if (!user.isActive) throw new Error('user not active');

    this.checkSocketUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };

    return user;
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    return Object.entries(this.connectedClients).map(
      ([socketId, { user }]) => ({
        socketId,
        fullName: user.fullName,
        roles: user.roles,
      }),
    );
  }

  getUserByClient(socketId: string) {
    const client = this.connectedClients[socketId];
    if (!client) throw new Error('Client not registered');
    return client.user;
  }

  getUserRole(socketId: string): string[] {
    return this.getUserByClient(socketId).roles;
  }
  getUserFullName(socketId: string): string {
    return this.getUserByClient(socketId).fullName;
  }

  getUserId(socketId: string): string {
    return this.getUserByClient(socketId).id;
  }

  hasRole(socketId: string, role: string): boolean {
    return this.getUserRole(socketId).includes(role);
  }

  checkSocketUserConnection(user: User) {
    for (const userId of Object.keys(this.connectedClients)) {
      const connectedClients = this.connectedClients[userId];

      if (connectedClients.user.id === user.id) {
        connectedClients.socket.disconnect();
        break;
      }
    }
  }

  getRoomsByRole(role: string): Socket[] {
    return Object.values(this.connectedClients)
      .filter((u) => u.user.roles.includes(role))
      .map((u) => u.socket);
  }

  emitToRole(role: string, event: string, payload: any) {
    const user = this.getRoomsByRole(role);
    user.forEach((socket) => socket.emit(event, payload));
  }

  async emitTaskByRole(role:string){
    const task = await this.taskService.findTaskByRole(role);
    const socket = this.getRoomsByRole(role)
    socket.forEach((socket) => socket.emit('task-list',task))
  }

  //revisar tareas que estan por vencer 
  @Cron('*/1 * * * *')
  async checkTask() {
    const now = new Date();
    const tasks = await this.taskService.findAll();

    tasks.forEach((task) => {
      if (task.isCompleted) return;

      const diffMinutes = (task.dueDate.getTime() - now.getTime()) / 1000 / 60;

      if (diffMinutes > 0 && diffMinutes <= 10) {
        // Emitimos alerta a admins y empleados
        ['admin', 'employee'].forEach((role) =>
          this.emitToRole(role, 'task-due-soon', {
            taskId: task.id,
            name: task.name,
            dueInMinutes: Math.floor(diffMinutes),
          }),
        );
      }
    });
  }
}
