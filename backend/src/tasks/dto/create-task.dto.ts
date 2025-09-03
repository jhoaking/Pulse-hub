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
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'task name',
    example: 'crear un nuevo repo',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'task description',
    example: ' crear un nuevo repositorio para alojar el proyecto',
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    description: 'date of the task when was created',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @ApiProperty({
    description: 'status of the task as (completed , delayed or pending)',
    example: 'pending',
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty({
    description: 'priority of the task as (low , medium or high)',
    example: 'low',
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({
    example: true,
    description: 'see that to task was completed',
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;


  @ApiProperty({
    description : 'duration of the task',
    example : '2d'
  })
  @IsString()
  @Matches(/^\d+(\.\d+)?[mhd]$/, {
    message: 'La duración debe ser algo como 10m, 2h o 1.5h',
  })
  duration: string;
}
