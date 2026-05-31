import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'joao@empresa.com' })
  @IsString({ message: 'O email deve ser uma string' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres' })
  password!: string;
}
