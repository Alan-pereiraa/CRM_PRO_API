import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'Email é obrigatório' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres' })
    password!: string;
}