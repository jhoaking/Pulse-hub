import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/auth-user.interface';
import { TwoFactorService } from './two-factor/two-factor.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly twoFactorService: TwoFactorService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    try {
      const user = this.userRepository.create({
        password: bcrypt.hashSync(password, 10),
        createdAt: new Date(),
        ...rest,
      });

      await this.userRepository.save(user);
      return { user };
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { password: true , id : true},
      });
      if (!user) throw new UnauthorizedException(`email : ${email} not valid`);

      if (!bcrypt.compare(password, user.password)) {
        throw new UnauthorizedException(`password : ${password} not valid`);
      }

      await this.twoFactorService.sendCodeEmail(user);

      return {
        message: 'e mando el codigo de verificacon a tu email',
        user,
      };
    } catch (error) {
      console.log(error);
    }
  }
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
}
