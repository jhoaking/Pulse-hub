import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt'
import {InjectRepository} from '@nestjs/typeorm'
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';



@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
    
    
  ){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new auth';
  }

 
  loginUser(loginUserDto : LoginUserDto){
    return 
  }
}
