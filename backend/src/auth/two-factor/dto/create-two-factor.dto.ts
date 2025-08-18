import { IsEmail, IsString } from 'class-validator';

export class RequestTwoFactorDto {
  @IsString()
  @IsEmail()
  email: string;
}
