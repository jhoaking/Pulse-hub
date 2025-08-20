import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Priority, Status } from '../types/task';
import { User } from 'src/auth/entities/auth.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text', {
    default: '',
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', {
    default: '0',
  })
  duration: string;

  @Column('enum', {
    enum: Status,
    default: Status.pending,
  })
  status: Status;

  @Column('enum', {
    enum: Priority,
    default: Priority.medium,
  })
  priority: Priority;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @Column('bool', {
    default: false,
  })
  isCompleted: boolean;

  @Column('timestamp')
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.task, { onDelete: 'CASCADE' })
  user: User;
}
