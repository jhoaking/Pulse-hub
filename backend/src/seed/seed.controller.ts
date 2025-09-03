import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';

import { Auth } from '../auth/Decorator/auth-roles.decorator';
import { ValidRoles } from '../auth/interface';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({ status: 200, description: 'SEED EXECUTED' })
  @Get()
  @ApiResponse({ status: 200, description: 'seed  was  correctly executed ' })
  @Auth(ValidRoles.admin)
  executedSeed() {
    return this.seedService.runSeed();
  }
}
