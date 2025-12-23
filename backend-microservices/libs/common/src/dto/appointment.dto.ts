import { IsNotEmpty, IsString, IsDate, IsEnum, IsOptional } from 'class-validator';

import { Type } from 'class-transformer';

export class CreateAppointmentDto {
    @IsOptional()
    @IsString()
    user?: string;

    @IsNotEmpty()
    @IsString()
    petName: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsString()
    time: string;

    @IsOptional()
    @IsString()
    service?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status?: string;
}

export class UpdateAppointmentDto {
    @IsOptional()
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date?: Date;

    @IsOptional()
    @IsString()
    time?: string;
}
