import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyTwoFactorDto {
  @ApiProperty({
    description : 'email of user',
    example : 'pepito@gmail.com'
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description : 'Code for verify and retur the token',
    example : '123456'
  })
  @IsString()
  @Length(6, 6, { message: 'The code must be exactly 6 digits' })
  code: string;
}
