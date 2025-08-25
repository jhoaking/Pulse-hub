import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

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
}
