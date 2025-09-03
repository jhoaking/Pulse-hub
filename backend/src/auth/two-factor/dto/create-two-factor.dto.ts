import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RequestTwoFactorDto {

  @ApiProperty({
    description : 'email of user',
    example : 'pepito@gmail.com'
  })
  @IsString()
  @IsEmail()
  email: string;
}
