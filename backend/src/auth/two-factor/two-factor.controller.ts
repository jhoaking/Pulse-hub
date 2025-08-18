import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { VerifyTwoFactorDto } from './dto/two-factor.dto';


@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post('verify')
  create(@Body() verifyTwoFactor: VerifyTwoFactorDto) {
    return this.twoFactorService.verifyCode(verifyTwoFactor);
  }


}
