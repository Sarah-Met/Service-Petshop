import { Controller, Post, Body, Inject, BadRequestException, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto, LoginDto } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController implements OnModuleInit {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) { }

    async onModuleInit() {
        await this.authClient.connect();
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'register' }, registerDto));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'login' }, loginDto));
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
