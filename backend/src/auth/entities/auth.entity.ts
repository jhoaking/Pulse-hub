import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { TwoFactor } from '../two-factor/entities/two-factor.entity';



@Entity({name : 'Users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
      @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: true,
  })
  password: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

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
  twoFactor:TwoFactor[]

  
}
