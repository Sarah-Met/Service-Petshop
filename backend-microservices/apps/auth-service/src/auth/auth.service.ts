import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { RegisterDto, LoginDto, ForgotPasswordDto } from '@app/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        try {
            // Check if user already exists
            const existingUser = await this.userService.findByEmail(registerDto.email);
            if (existingUser) {
                // Return generic object error or RpcException
                throw new RpcException('User already exists with this email');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);

            // Create new user
            const newUser = await this.userService.create({
                ...registerDto,
                password: hashedPassword,
                role: 0
            });

            // Generate JWT token
            const token = this.jwtService.sign({
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
            });

            return {
                success: true,
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    role: newUser.role,
                },
                token,
            };
        } catch (error) {
            if (error instanceof RpcException) throw error;
            throw new RpcException(error.message);
        }
    }

    async login(loginDto: LoginDto) {
        try {
            // Find user by email
            const user = await this.userService.findByEmail(loginDto.email);
            if (!user) {
                throw new RpcException('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new RpcException('Invalid credentials');
            }

            // Generate JWT token
            const token = this.jwtService.sign({
                id: user._id,
                email: user.email,
                role: user.role,
            });

            return {
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                },
                token,
            };
        } catch (error) {
            throw new RpcException(error.message);
        }
    }

    async validateToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            return null;
        }
    }
}
