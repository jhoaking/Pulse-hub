import { User } from 'src/auth/entities/auth.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name : 'twoFactor'})
export class TwoFactor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  code: string;

  @Column('text',{unique : true})
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('bool', {
    default: false,
  })
  isUsed: boolean;

  @Column()
  expiresAt: Date;


  @ManyToOne(
    () => User,
    (user) => user.twoFactor,
    {onDelete : 'CASCADE'}
  )
  user:User
}
