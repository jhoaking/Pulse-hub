import { Controller, Get, Post, Body} from '@nestjs/common';

import { Auth } from './Decorator/auth-roles.decorator';
import { GetUser } from './Decorator';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/auth.entity';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto : LoginUserDto){
    return this.authService.loginUser(loginUserDto)
  }

  @Get('status')
  @Auth()
  checkStatusOfUser(@GetUser() user:User){
    return this.authService.checkStatus(user)
  }
  
}
