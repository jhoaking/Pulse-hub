import { Controller, Post, Body,} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { TwoFactorService } from './two-factor.service';
import { VerifyTwoFactorDto } from './dto/two-factor.dto';
import { TwoFactor } from './entities/two-factor.entity';


@ApiTags('TwoFactor')
@Controller('two-factor')
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}


  @ApiResponse({status : 201 , description : 'token was send to your email', type : TwoFactor})
  @Post('verify')
  create(@Body() verifyTwoFactor: VerifyTwoFactorDto) {
    return this.twoFactorService.verifyCode(verifyTwoFactor);
  }


}
