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
    description : 'description of the task'
  })
  @Column('text', {
    default: '',
  })
  description: string;


  @ApiProperty({
    example : '2025-08-09',
    description : 'when to task was created '
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example : '2h',
    description : 'duration of the task'
  })
  @Column('text', {
    default: '0',
  })
  duration: string;

  @ApiProperty({
    enum : Status,
    description : 'status of the task as (pending,completed,delayed)'
  })
  @Column('enum', {
    enum: Status,
    default: Status.pending,
  })
  status: Status;

   @ApiProperty({
    enum : Priority,
    description : 'priority of the task as (low,medium,high)'
  })
  @Column('enum', {
    enum: Priority,
    default: Priority.medium,
  })
  priority: Priority;

  
  @ApiProperty({
    example : true,
    description : 'see that to task was completed'
  })
  @Column('bool', {
    default: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    example : '2025-08-09',
    description  : 'see when the task is due'
  })
  @Column('timestamp')
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.task, {eager : true})
  user: User;
 
}
