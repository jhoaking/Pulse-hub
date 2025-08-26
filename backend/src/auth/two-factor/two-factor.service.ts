import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { AuthService } from '../auth.service';
import { User } from '../entities/auth.entity';

import { EmailService } from './emailService/sendEmail';

import { TwoFactor } from './entities/two-factor.entity';
import { VerifyTwoFactorDto } from './dto/two-factor.dto';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(TwoFactor)
    private readonly twoFactorService: Repository<TwoFactor>,
    private readonly emailService: EmailService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async sendCodeEmail(user: User) {
    const userExist = await this.twoFactorService.findOne({
      where: {
        email: user.email,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        user: true,
      },
    });

    if (userExist) {
      await this.sendEmail(user.email, userExist.code);
      return;
    }

    const code = this.generatedCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const saveData = this.twoFactorService.create({
      code: code,
      email: user.email,
      createdAt: new Date(),
      expiresAt,
      user,
    });

    await this.twoFactorService.save(saveData);
    await this.sendEmail(user.email, code);
  }

  async verifyCode({
    email,
    code,
  }: VerifyTwoFactorDto): Promise<{ token: string }> {
    const recordUser = await this.twoFactorService.findOne({
      where: { email, code, isUsed: false },
      relations: {
        user: true,
      },
    });

    if (!recordUser || recordUser.expiresAt < new Date())
      throw new UnauthorizedException('invalid or expired code ');

    ((recordUser.isUsed = true), await this.twoFactorService.save(recordUser));
    const token = this.authService.getJwtToken({ id: recordUser.user.id });

    return { token: token };
  }

  private generatedCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private sendEmail(to: string, code: string) {
    return this.emailService.sendCode(to, code);
  }
}
