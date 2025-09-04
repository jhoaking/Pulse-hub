import { Controller, Get, Post, Body } from '@nestjs/common';

import { Auth } from './Decorator/auth-roles.decorator';
import { GetUser } from './Decorator';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/auth.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'user was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({ status: 201, description: 'User was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @ApiResponse({status : 200 , description : 'user was authenticated'})
  @ApiResponse ({status : 400 , description : 'Bad Request'})
  @ApiResponse({status : 403 ,description : 'Forbidden Token releated'})
  @Get('status')
  @Auth()
  checkStatusOfUser(@GetUser() user: User) {
    return this.authService.checkStatus(user);
  }
}  
