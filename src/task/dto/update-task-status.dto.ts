import { IsEnum } from 'class-validator';
import { StatusTask } from '../../../generated/prisma/enums';

export class UpdateTaskStatusDto {
  @IsEnum(StatusTask)
  status!: StatusTask;
}
