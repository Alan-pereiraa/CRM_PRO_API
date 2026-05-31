import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Maria Oliveira' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name!: string;

  @ApiProperty({ example: 'maria@empresa.com' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString({ message: 'O telefone deve ser uma string' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  phone!: string;

  @ApiProperty({ example: 'Gerente comercial' })
  @IsNotEmpty({ message: 'O cargo é obrigatório' })
  @IsString({ message: 'O cargo deve ser uma string' })
  role!: string;

  @ApiProperty({ example: '8b6d5e5d-4f8a-4a40-9cf5-2f6c3d8f7f9b' })
  @IsNotEmpty({ message: 'O ID do projeto é obrigatório' })
  @IsUUID()
  projectId!: string;
}
