import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Priority, Status } from '../types/task';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  duration: string;

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
}
