import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TwoFactor } from '../two-factor/entities/two-factor.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Users' })
export class User {

  @ApiProperty({
    description : 'id of user',
    example : '1efcdae9-4507-496e-97c0-48685574dedc',
    uniqueItems : true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description : 'name user',
    example : 'Pepito Gomez'
  })
  @Column('text')
  fullName: string;

   @ApiProperty({
    description : 'email of user',
    example : 'papeto123@gmail.com',
    uniqueItems : true
  })
  @Column('text', {
    unique: true,
  })
  email: string;

   @ApiProperty({
    description : 'password of user',
    example : 'Abc123'
  })
  @Column('text', {
    select: true,
  })
  password: string;

   @ApiProperty({
    description : 'see that the user this active',
    example : true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

   @ApiProperty({
    description : 'when the user was created',
    example : '2025-09-13'
  })
  @CreateDateColumn()
  createdAt: Date;

   @ApiProperty({
    description : 'role of user',
    example : 'admin',
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(
    () => TwoFactor,
    (twoFactor) => twoFactor.user,
    //cascade por si acaso
  )
  twoFactor: TwoFactor[];

  @OneToMany(() => Task, (task) => task.user)
  task: Task[];
}
