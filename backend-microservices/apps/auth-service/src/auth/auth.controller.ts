import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@app/common';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @MessagePattern({ cmd: 'register' })
    async register(@Payload() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @MessagePattern({ cmd: 'login' })
    async login(@Payload() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @MessagePattern({ cmd: 'validate_token' })
    async validateToken(@Payload() token: string) {
        return this.authService.validateToken(token);
    }
}
