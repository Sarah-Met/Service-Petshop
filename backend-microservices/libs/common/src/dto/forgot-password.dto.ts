import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    securityAnswer: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
