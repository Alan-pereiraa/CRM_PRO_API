import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty({ message: 'Email é obrigatório' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres' })
    password!: string;
}