import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusTask, Priority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Ligar para cliente' })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title!: string;

  @ApiPropertyOptional({ example: 'Follow-up após reunião' })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({ enum: StatusTask })
  @IsOptional()
  @IsEnum(StatusTask, { message: 'Status inválido' })
  status?: StatusTask;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority, { message: 'Prioridade inválida' })
  priority?: Priority;

  @ApiPropertyOptional({ example: '2026-05-30' })
  @IsOptional()
  @IsDateString({}, { message: 'A data de entrega deve ser uma data válida' })
  dueDate?: string;

  @ApiProperty({ example: '8b6d5e5d-4f8a-4a40-9cf5-2f6c3d8f7f9b' })
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do projeto é obrigatório' })
  projectId!: string;
}
