import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyTwoFactorDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'The code must be exactly 6 digits' })
  code: string;
}
