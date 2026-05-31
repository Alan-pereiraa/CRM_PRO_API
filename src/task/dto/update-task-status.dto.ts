import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatusTask } from '../../../generated/prisma/enums';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: StatusTask })
  @IsEnum(StatusTask, { message: 'Status inválido' })
  status!: StatusTask;
}
