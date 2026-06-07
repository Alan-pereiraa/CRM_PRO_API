import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusTask } from '@prisma/client';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: StatusTask })
  @IsEnum(StatusTask, { message: 'Status inválido' })
  status!: StatusTask;
}
