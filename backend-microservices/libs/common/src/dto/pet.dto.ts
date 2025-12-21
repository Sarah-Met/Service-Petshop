import { IsNotEmpty, IsString, IsNumber, IsArray, IsEnum, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePetDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    breed: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    age: number;

    @IsNotEmpty()
    @IsEnum(['weeks', 'months', 'years'])
    ageUnit: string;

    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    price: number;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    characteristics: string[];

    @IsOptional()
    @IsString()
    owner: string;
}

export class UpdatePetDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    breed?: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    age?: number;

    @IsOptional()
    @IsEnum(['weeks', 'months', 'years'])
    ageUnit?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => Number(value))
    price?: number;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    characteristics?: string[];
}
