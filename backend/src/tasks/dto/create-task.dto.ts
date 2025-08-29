import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Priority, Status } from '../types/task';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsString()
  @Matches(/^\d+(\.\d+)?[mhd]$/, {
    message: 'La duración debe ser algo como 10m, 2h o 1.5h',
  })
  duration: string;

}
