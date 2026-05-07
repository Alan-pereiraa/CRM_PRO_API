import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateFunnelDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    position!: number;

    @IsString()
    @IsNotEmpty()
    color!: string;
}