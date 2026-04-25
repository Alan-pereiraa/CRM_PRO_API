import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @MinLength(3, { message: 'O nome deve conter pelo menos 3 caracteres' })
    name!: string;

    @IsEmail({}, { message: 'Email inválido' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres' })
    password!: string;
}
