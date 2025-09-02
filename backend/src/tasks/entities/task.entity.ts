import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Priority, Status } from '../types/task';

import { User } from '../../auth/entities/auth.entity';




@Entity({ name: 'tasks' })
export class Task {

  @ApiProperty({
    example : '1efcdae9-4507-496e-97c0-48685574defc',
    description : 'task ID',
    uniqueItems : true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ApiProperty({
    example : 'Redactar informe mensual',
    description : 'name for to task'
  })
  @Column('text')
  name: string;

  @ApiProperty({
    example : 'redactar el informe de una migracion',
    description : 'description of to task'
  })
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

  @ManyToOne(() => User, (user) => user.task, {eager : true})
  user: User;
 
}
