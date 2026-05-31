import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StatusProject, Priority } from '../../../generated/prisma/enums';

export class CreateProjectDto {
  @ApiProperty({ example: 'Projeto Alpha' })
  @IsString({ message: 'O título deve ser uma string' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  title!: string;

  @ApiPropertyOptional({ example: 'Conta estratégica para Q3' })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({ enum: StatusProject })
  @IsOptional()
  @IsEnum(StatusProject, { message: 'Status inválido' })
  status?: StatusProject;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority, { message: 'Prioridade inválida' })
  priority?: Priority;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'O valor deve ser um número válido' })
  value?: number;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString({}, { message: 'A data de entrega deve ser uma data válida' })
  deadline?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt({ message: 'A posição deve ser um número inteiro' })
  position?: number;

  @ApiProperty({ example: '8b6d5e5d-4f8a-4a40-9cf5-2f6c3d8f7f9b' })
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do funil é obrigatório' })
  funnelId!: string;
}
