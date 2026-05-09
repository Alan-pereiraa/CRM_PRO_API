import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusTask, Priority } from '../../../generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty({ example: 'Ligar para cliente' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Follow-up após reunião' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: StatusTask })
  @IsOptional()
  @IsEnum(StatusTask)
  status?: StatusTask;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: '2026-05-30' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: '8b6d5e5d-4f8a-4a40-9cf5-2f6c3d8f7f9b' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;
}
