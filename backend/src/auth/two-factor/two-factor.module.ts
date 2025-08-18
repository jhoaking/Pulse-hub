import { forwardRef, Module } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { TwoFactorController } from './two-factor.controller';
import { EmailService } from './emailService/sendEmail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactor } from './entities/two-factor.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth.module';

@Module({
  controllers: [TwoFactorController],
  providers: [TwoFactorService, EmailService],
  imports: [
    TypeOrmModule.forFeature([TwoFactor]),
    forwardRef(() => AuthModule),
    PassportModule,
  ],
  exports: [TypeOrmModule, TwoFactorService],
})
export class TwoFactorModule {}
