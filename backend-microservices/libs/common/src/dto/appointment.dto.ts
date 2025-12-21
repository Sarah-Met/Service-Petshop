import { IsNotEmpty, IsString, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    user: string;

    @IsString()
    pet?: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsString()
    time: string;

    @IsNotEmpty()
    @IsString()
    service: string;

    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status?: string;
}

export class UpdateAppointmentDto {
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status?: string;

    @Type(() => Date)
    @IsDate()
    date?: Date;

    @IsString()
    time?: string;
}
