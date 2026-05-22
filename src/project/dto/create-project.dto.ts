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
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Conta estratégica para Q3' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: StatusProject })
  @IsOptional()
  @IsEnum(StatusProject)
  status?: StatusProject;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({ example: '8b6d5e5d-4f8a-4a40-9cf5-2f6c3d8f7f9b' })
  @IsUUID()
  @IsNotEmpty()
  funnelId!: string;
}
