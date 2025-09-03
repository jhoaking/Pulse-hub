import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/auth.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name : 'twoFactor'})
export class TwoFactor {

  @ApiProperty({
    description : 'id of user for your code ',
    example : '1efcdae9-4507-496e-97c0-48685574dedc',
    uniqueItems : true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ApiProperty({
    description : 'code for verify the user',
    example  :'19234',
    uniqueItems : true
  })
  @Column('text', {
    unique: true,
  })
  code: string;

  @ApiProperty({
    description : 'email of user',
    example : 'pepito@gmail.com'
  })
  @Column('text',{unique : true})
  email: string;

  @ApiProperty({
    description : 'When was created the code',
    example : '2025-09-09'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description : 'if the code was used',
    example : false
  })
  @Column('bool', {
    default: false,
  })
  isUsed: boolean;

  @ApiProperty({
    description : 'when the code expired',
    example : '2025-09-09'
  })
  @Column()
  expiresAt: Date;


  @ManyToOne(
    () => User,
    (user) => user.twoFactor,
    {onDelete : 'CASCADE'}
  )
  user:User
}
