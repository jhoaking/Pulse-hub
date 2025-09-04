import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';



@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({ status: 200, description: 'SEED EXECUTED' })
  @Get()
  executedSeed() {
    return this.seedService.runSeed();
  }
} 
               