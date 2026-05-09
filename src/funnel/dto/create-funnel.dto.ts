import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFunnelDto {
  @ApiProperty({ example: 'Pipeline Comercial' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  position!: number;

  @ApiProperty({ example: '#FFAA00' })
  @IsString()
  @IsNotEmpty()
  color!: string;
}
