import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Maria Oliveira' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'maria@empresa.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'Gerente comercial' })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiProperty({ example: '8b6d5e5d-4f8a-4a40-9cf5-2f6c3d8f7f9b' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;
}
