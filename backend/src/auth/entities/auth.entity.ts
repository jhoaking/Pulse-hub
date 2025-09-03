import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TwoFactor } from '../two-factor/entities/two-factor.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: true })
  password: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => TwoFactor, (twoFactor) => twoFactor.user)
  twoFactor: TwoFactor[];

  @OneToMany(() => Task, (task) => task.user)
  task: Task[];
}
